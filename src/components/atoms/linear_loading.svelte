<script lang="ts">
	import LinearProgress from '@smui/linear-progress';

	export let progress = 0;
	export let buffer = 0;
	export let indeterminate = false;
	export let closed: boolean;
	let className = '';
	export { className as class };
</script>

<LinearProgress {closed} {progress} {buffer} {indeterminate} class={className} />
