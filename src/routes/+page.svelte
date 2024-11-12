<script lang="ts">
    let { data } = $props();
    console.log(data.forecast);
</script>

{#if data.errorMessage}
    <p>{data.errorMessage}</p>
{/if}

<!-- todo, shitty experience, set a default location for people to see app working right away-->
<a href="/manage-locations">Add a location to get started!</a>

