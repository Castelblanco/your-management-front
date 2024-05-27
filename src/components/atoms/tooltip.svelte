<script lang="ts">
	import { Label } from '@smui/common';
	import Tooltip, { Wrapper } from '@smui/tooltip';

	export let xPos: 'detected' | 'start' | 'center' | 'end' | undefined = undefined;
	export let yPos: 'detected' | 'above' | 'below' | undefined = undefined;
	export let content: string;
	export let style: string | undefined = undefined;
</script>

<Wrapper>
	<slot />
	<Tooltip {xPos} {yPos} style="z-index: 100000000;">
		<Label {style}>{content}</Label>
	</Tooltip>
</Wrapper>
