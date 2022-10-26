<template>
	<div class="hello">
		<div>{{ msg }}</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
	props: {
		msg: {
			type: String,
			required: false,
			default: "This is a default message",
		},
	},
});
</script>
