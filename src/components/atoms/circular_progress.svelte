<script lang="ts">
	import CircularProgress from '@smui/circular-progress';
	export let progress = 0;
	export let indeterminate = false;
	export let style = '';
	let className = '';
	export { className as class };
</script>

<CircularProgress {progress} {indeterminate} class={className} {style} />
