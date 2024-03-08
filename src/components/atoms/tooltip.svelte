<script lang="ts">
	import Tooltip, { Wrapper } from '@smui/tooltip';

	export let xPos: 'detected' | 'start' | 'center' | 'end' | undefined = undefined;
	export let yPos: 'detected' | 'above' | 'below' | undefined = undefined;
	export let content: string;
</script>

<Wrapper>
	<slot />
	<Tooltip {xPos} {yPos}>{content}</Tooltip>
</Wrapper>
