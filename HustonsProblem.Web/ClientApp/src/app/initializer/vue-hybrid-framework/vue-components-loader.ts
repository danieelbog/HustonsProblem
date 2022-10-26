import { useEventStore } from "./../../../store/event-store";
import Vue, { AsyncComponent } from "vue";
import { pinia } from "../pinia/pinia";
import { resolveOne } from "./dynamics";

Vue.config.devtools = true;

export async function loadFromDOM() {
	var vueElements = document.querySelectorAll("vue");

	console.log("loadFromDOM triggered for", vueElements);

	vueElements.forEach((el) => {
		console.debug(`Attaching Vue Compoment: ${el.getAttribute("component")}...`);

		var props: Array<Attr> = [].slice.call(el.attributes).filter(function (attr: Attr) {
			return !attr || !attr.name || attr.name.indexOf("component") != 0;
		});

		var propsStr: Array<string> = props.map((attr) => {
			// Remove "vue-loader" class if exists
			if (attr.name == "class") {
				attr.value = attr.value.replace("vue-loader", "");
			}

			// In order to support JSON as prop we use single quote's for attributes value,
			// to allow for double quotes inside the JSON.

			//&#34 = "
			//&#39 = '

			// Escape single quotes inside attribute's value since we are going to use them as start/end markers on the HTML
			var escapedValue = attr.value.replace(/'/gm, "&#39;");
			return `${attr.name}='${escapedValue}'`;
		});

		var propsJoined = propsStr.join(" ");

		var componentId = el.getAttribute("component");
		if (!componentId) throw new Error("Missing attribute 'component'");

		// Convert special characters to hyphens (-) to comply with HTML tag
		var tagName = componentId.replace(/[^\w]/gm, "-");

		var template = `<${tagName} v-bind="$attrs" ${propsJoined}></${tagName}>`;
		new Vue({
			el: el,
			template: template,
			components: {
				[tagName]: getComponent(componentId),
			},
			pinia,
		});

		//@ts-ignore, cant wats
		window.Vue = Vue;

		//@ts-ignore, cant wats
		window.iw = {};

		//@ts-ignore, cant wats
		window.iw.vue = {
			eventStore: useEventStore(pinia),
		};
	});
}

const defaultResolver = async function (componentName: string) {
	return (await resolveOne({ type: "vue-component", id: componentName })).import();
};

function getComponent(componentName: string): AsyncComponent<any, any, any, any> {
	console.log("getComponent triggered");
	return () => ({
		//@ts-ignore - Reason: Can't find how to instruct Typescript about Vue's dynamic components
		component: defaultResolver(componentName) as any,
		loading: {
			template: `<span>Loading...</span>`,
		},
		error: {
			template: `<span>Dynamic component error</span>`,
		},
		delay: 500,
		timeout: 5000,
	});
}
