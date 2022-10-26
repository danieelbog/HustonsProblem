<template>
	<div class="hello">
		<div>
			{{ message}}
		</div>
</template>

<script>
import { defineComponent, onMounted, ref, watch, nextTick } from "@vue/composition-api";
import { useEventStore } from "../store/event-store";
import {pinia } from "../app/initializer/pinia/pinia"
export default defineComponent({
	setup(props, context) {
		const message = ref("Hello World from the Vue World");
		
		const eventStore = useEventStore();
		// watch(
		// 	() => eventStore,
		// 	(newEvent) => {
		// 		if (newEvent.eventName != "recievedMessage") return;
		// 		console.log("I AM TRIGGERED")
		// 	},
		// 	{ deep: true },
		// );
		onMounted(()=> {
			nextTick(()=> {
					eventStore.emitNewEvent("hello-world")

			})

		})

		watch(
			pinia.state,
			(state) => {
				console.log("Event triggered with the name:", state.eventBus.eventName);
			},
			{ deep: true }
			)
		
		return {
			message
		};
	},
});
</script>
