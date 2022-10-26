import Vue, { VNode } from "vue";

declare global {
	namespace JSX {
		interface Element extends VNode {}
		interface ElementClass extends Vue {}
		interface IntrinsicElements {
			[elem: string]: any;
		}

		//https://github.com/vuejs/vue-cli/issues/2417#issuecomment-692066272
		interface ElementAttributesProperty {
			$props: {};
		}
	}
}
