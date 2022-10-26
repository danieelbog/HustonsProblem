export default {
	refs: [
		{
			type: "vue-component",
			id: "hello-world",
			import: () => import("./hello-world.vue"),
		},
	],
};
