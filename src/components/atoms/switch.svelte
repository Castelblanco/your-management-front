<script lang="ts">
	import Switch from '@smui/switch';

	export let disabled = false;
	export let value: any = undefined;
	export let color: 'primary' | 'secondary' = 'primary';
	export let checked: boolean;
	export let icons: boolean = true;
</script>

<Switch bind:checked {color} {icons} {disabled} {value} />
