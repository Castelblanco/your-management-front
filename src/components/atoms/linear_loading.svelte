<script lang="ts">
	import LinearProgress from '@smui/linear-progress';

	export let progress = 0;
	export let buffer = 0;
	export let indeterminate = false;
	export let loading: boolean;
	let className = '';
	export { className as class };
</script>

<LinearProgress closed={!loading} {progress} {buffer} {indeterminate} class={className} />
