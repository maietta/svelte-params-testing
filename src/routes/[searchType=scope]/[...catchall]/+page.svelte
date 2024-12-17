<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { queryParameters, ssp } from 'sveltekit-search-params';
	import { propertySchema } from '$lib/schemas/property-schema';

	const system = $state({ Class: '', Type: '', page: 1 });

	const form = queryParameters(
		{
			page: ssp.number(1),
			Area: {
				encode: (value) => (value && value.trim() ? value : undefined),
				decode: (value) => (value && value.trim() ? value : undefined),
				defaultValue: ''
			},

			AcresMin: ssp.number(0),

			NumOfBedroomsMin: {
				encode: (value) => (value && value.trim() ? value : undefined),
				decode: (value) => (value && value.trim() ? value : undefined),
				defaultValue: ''
			},
			NumOfBathroomsMin: {
				encode: (value) => (value && value.trim() ? value : undefined),
				decode: (value) => (value && value.trim() ? value : undefined),
				defaultValue: ''
			},

			 AskingPriceMin: ssp.number(0),
			 AskingPriceMax: ssp.number(4500000),
			// AskingPriceMax: {
			// 	encode: (value) => {
			// 		// Ensure it's a valid number and format it with the dollar sign
			// 		return value && !isNaN(value) ? `$${value}` : undefined;
			// 	},
			// 	decode: (value) => {
			// 		// Remove the dollar sign and parse the number
			// 		if (value && typeof value === 'string') {
			// 			const numberValue = parseFloat(value.replace(/[^0-9.-]+/g, ''));
			// 			return !isNaN(numberValue) ? numberValue : undefined;
			// 		}
			// 		return undefined;
			// 	}
			// }
			View: {
				encode: (value) => (value && value.trim() ? value : undefined),
				decode: (value) => (value && value.trim() ? value : undefined),
				defaultValue: ''
			},
			Levels: {
				encode: (value) => (value && value.trim() ? value : undefined),
				decode: (value) => (value && value.trim() ? value : undefined),
				defaultValue: ''
			}
		},
		{
			pushHistory: false, // Enables updating the browser history
			showDefaults: false, // Don't include default values in the query string
			debounceHistory: 50,
			sort: false // Leave this off
		}
	);

	// Initialize values on mount
	onMount(() => {
		// IF there is a `page` in URL params, then use it
		if (page.url.searchParams.get('page')) $form.page = Number(page.url.searchParams.get('page'));
		const [classSegment, typeSegment] = page.params.catchall.split('/').filter(Boolean);
		system.Class = classSegment || '';
		system.Type = typeSegment || '';
	});

	let previousUrl = '';

	function formHasBeenChanged() {
		// If class is not residential, clear bedrooms and bathrooms
		if (system.Class !== 'residential') {
			$form.NumOfBathroomsMin = '';
			$form.NumOfBathroomsMin = '';
		}

		// If class is not land, clear acres
		if (system.Class !== 'land') {
			$form.AcresMin = 0;
		}

		// $form.AskingPriceMin = 0; // Reset to the default. (0's are ignored by search engine)
		// $form.AskingPriceMax = 4500000; // Reset to the default. (0's are ignored by search engine)

		// Loop over form to reset all fields. TODO: There's a feature to do this all at once. Unsure how to use it because docs are lacking and code is unclear.
		for (const key in form) {
			if (form.hasOwnProperty(key)) {
				if (key == 'set' || key == 'subscribe' || key == 'update') continue;
				$form[key] = undefined; // Reset value
			}
		}
	}

	$effect(() => {
		if (form) formHasBeenChanged();
	});

	$effect(() => {
		if (system) {
			const url = rebuildURL();
			if (url !== previousUrl) {
				previousUrl = url;
				goto(url, { replaceState: true, keepFocus: true });
			}
		}
	});

	function rebuildURL() {
		let url = '/' + page.params.searchType; // New way after addressing bug in route matching.
		if (system.Class) {
			url += `/${encodeURIComponent(system.Class)}`;
			if (system.Type) url += `/${encodeURIComponent(system.Type)}`;
		} else {
            console.log('no class')
        }

		// Guard rail for invalid property class types
		const validTypes = propertySchema[system.Class]?.types?.map((t) => t.slug) || [];
		if (!validTypes.includes(system.Type)) {
			system.Type = '';
		}

		const searchParams = new URLSearchParams(page.url.searchParams);
		// If referrer does not start with /details, set page to 1.
		if (!page.url.searchParams.get('referrer')?.startsWith('/details')) {
			searchParams.set('page', '1');
		}

		return `${url}?${searchParams.toString()}`.toString();
	}

	/***
	 * Form specific logic
	 */
	const classes = Object.entries(propertySchema).map(([key, value]) => ({
		value: key,
		label: value.label
	}));
</script>

{page.data.pathname}

<form id="search" class="flex flex-col p-2 text-xl font-light shadow-xs">
	<label for="Class">Property Type:</label>
	<select name="Class" id="Class" bind:value={system.Class}>
		<option value="">— choose a property type —</option>
		{#each classes as { value, label }}
			<option {value}>{label}</option>
		{/each}
	</select>

	{#if system.Class === 'residential'}
		<label for="Type">Type of Residential:</label>
		<select name="Type" bind:value={system.Type}>
			<option value="">— any type of residential —</option>
			{#each propertySchema[system.Class]?.types ?? [] as type}
				<option value={type.slug}>{type.label}</option>
			{/each}
		</select>

		<label for="View">Primary View</label>
		<select name="View" id="View" bind:value={$form.View}>
			<option value="">— any type of view —</option>
			{#each propertySchema[system.Class]?.fields?.find((field) => field.name === 'View')?.options ?? [] as option}
				<option value={option.label}>{option.label}</option>
			{/each}
		</select>

		<label for="Levels">Levels / Stories / Floors</label>
		<select name="Levels" id="Levels" bind:value={$form.Levels}>
			<option value="">— any —</option>
			{#each propertySchema[system.Class]?.fields?.find((field) => field.name === 'Levels')?.options ?? [] as option}
				<option value={option.label}>{option.label}</option>
			{/each}
		</select>

		<div class="w-full">
			<div class="flex flex-wrap gap-0">
				<div class="w-1/2 pr-1">
					<label for="NumOfBedroomsMin">Bedrooms:</label>
					<select
						name="NumOfBedroomsMin"
						id="NumOfBedroomsMin"
						class="w-full"
						bind:value={$form.NumOfBedroomsMin}
					>
						<option value="">Any</option>
						<option value="1">1 or more</option>
						<option value="2">2 or more</option>
						<option value="3">3 or more</option>
						<option value="4">4 or more</option>
						<option value="5">5+ or more</option>
					</select>
				</div>
				<div class="w-1/2 pl-1">
					<label for="NumOfBathroomsMin">Bathrooms:</label>
					<select
						name="NumOfBathroomsMin"
						id="NumOfBathroomsMin"
						class="w-full"
						bind:value={$form.NumOfBathroomsMin}
					>
						<option value="">Any</option>
						<option value="1">1 or more</option>
						<option value="2">2 or more</option>
						<option value="3">3 or more</option>
						<option value="4">4 or more</option>
						<option value="5">5+ or more</option>
					</select>
				</div>
			</div>
		</div>
	{/if}

	{#if system.Class === 'commercial'}
		<label for="Type">Type of Commercial:</label>
		<select name="Type" bind:value={system.Type} class="w-full">
			<option value="">— choose commercial type —</option>
			{#each propertySchema[system.Class]?.types ?? [] as type}
				<option value={type.slug}>{type.label}</option>
			{/each}
		</select>
	{/if}

	{#if system.Class === 'land'}
		<label for="Type">Type of Land:</label>
		<select name="Type" bind:value={system.Type} class="w-full">
			<option value="">— choose land type —</option>
			{#each propertySchema[system.Class]?.types ?? [] as type}
				<option value={type.slug}>{type.label}</option>
			{/each}
		</select>
	{/if}

	{#if system.Class === 'multi-family'}
		<label for="Type"> Type of Multi-Family: </label>
		<select name="Type" bind:value={system.Type} class="w-full">
			<option value="">— choose multi-family property type —</option>
			{#each propertySchema[system.Class]?.types ?? [] as type}
				<option value={type.slug}>{type.label}</option>
			{/each}
		</select>
	{/if}

	<label for="Area">Location:</label>
	<select name="Area" id="Area" class="w-full" bind:value={$form.Area}>
		<option value="">Anywhere in Del Norte County</option>
		<option value="Big Flat">Big Flat</option>
		<option value="Crescent City">Crescent City</option>
		<option value="Elk Valley">Elk Valley</option>
		<option value="Fort Dick">Fort Dick</option>
		<option value="Gasquet">Gasquet</option>
		<option value="Hiouchi">Hiouchi</option>
		<option value="Klamath">Klamath</option>
		<option value="Klamath Glenn">Klamath Glenn</option>
		<option value="Lake Earl">Lake Earl</option>
		<option value="Orick">Orick</option>
		<option value="Smith River">Smith River</option>
		<option value="Other">Other</option>
	</select>

	<fieldset class="w-full">
		<legend class="text-base font-medium text-green-900"> Asking Price (dollar amount): </legend>
		<div class="flex flex-wrap gap-0">
			<!-- Minimum Asking Price -->
			<div class="w-1/2 pr-1">
				<label for="AskingPriceMin" class="block font-medium text-green-900"> Min: </label>
				<input
					id="AskingPriceMin"
					name="AskingPriceMin"
					type="number"
					bind:value={$form.AskingPriceMin}
					maxlength="6"
					class="w-full"
				/>
			</div>
			<!-- Maximum Asking Price -->
			<div class="w-1/2 pl-1">
				<label for="AskingPriceMax" class="block font-medium text-green-900"> Max: </label>
				<input
					type="number"
					name="AskingPriceMax"
					id="AskingPriceMax"
					step="500000"
					bind:value={$form.AskingPriceMax}
					class="w-full"
				/>
			</div>
		</div>
	</fieldset>

	<div class="w-full text-right">
		<!-- <button type="submit" class="btn-primary btn btn-lg w-full">Search</button> -->
		<a
			href="/search"
			role="button"
			onclick={(e) => {
				e.preventDefault();
				Object.keys($form).forEach((key) => ($form[key] = ''));
			}}
		>
			Reset Search
		</a>
	</div>
</form>
