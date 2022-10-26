import { defineStore } from "pinia";

export const useEventStore = defineStore("eventBus", {
	state: () => ({
		eventName: null as String | null,
		args: null as any,
	}),
	actions: {
		emitNewEvent(eventName: string, args: any = null) {
			this.clearState();
			this.eventName = eventName;
			this.args = args;
		},
		onEvent(eventName: string) {
			if (eventName == this.eventName) console.log("stop");
		},
		clearState() {
			this.eventName = null;
			this.args = null;
		},
	},
});
