# MultipleSelector Component Usage Guide

The `MultipleSelector` component is a **powerful dropdown input** supporting:

- Single-select
- Multi-select
- Local (sync) search
- Async server-side search
- Custom empty states

This guide documents **props, usage examples, and React Hook Form integration**.

---

## Basic Props

| Prop             | Type                                   | Required | Description                                                                |
| ---------------- | -------------------------------------- | -------- | -------------------------------------------------------------------------- |
| `options`        | `Option[]`                             | ✅       | Full list of available options.                                            |
| `defaultOptions` | `Option[]`                             | ❌       | Options to show initially (commonly same as `options`).                    |
| `value`          | `Option[]`                             | ✅       | Currently selected option(s). Always an array, even in single-select mode. |
| `onChange`       | `(options: Option[]) => void`          | ✅       | Callback fired when selection changes.                                     |
| `placeholder`    | `string`                               | ❌       | Placeholder text inside input.                                             |
| `emptyIndicator` | `React.ReactNode`                      | ❌       | Custom UI when no results found (e.g., "No courts found").                 |
| `maxSelected`    | `number`                               | ❌       | Maximum allowed selections. Use `1` for single select.                     |
| `onSearchSync`   | `(query: string) => Option[]`          | ❌       | Client-side search filter (used for small to medium option sets).          |
| `onSearch`       | `(query: string) => Promise<Option[]>` | ❌       | Async search handler for large datasets (queries backend).                 |

---

## Option Shape

```ts
interface Option {
  label: string;   // Text shown to the user
  value: string;   // Value used in backend/forms
  disable?: boolean; // (Optional) disables selection of this option
}


Usage Examples
1. Simple Single Select (with search)
Use case: when you need to select one item from a moderate list.

tsx
Copy
Edit
<MultipleSelector
  options={[
    { label: "High Court", value: "high" },
    { label: "District Court", value: "district" },
  ]}
  defaultOptions={[]}
  value={selected ? [selected] : []}
  onChange={(selected) => setSelected(selected[0] ?? null)}
  maxSelected={1}
  placeholder="Select a court..."
/>
👉 Explanation:

maxSelected={1} ensures only one option can be picked.

Since value is always an array, we map [selected] when something is picked.

2. Multi Select (tags style)
Use case: selecting multiple categories, tags, or skills.

tsx
Copy
Edit
<MultipleSelector
  options={[
    { label: "Civil", value: "civil" },
    { label: "Criminal", value: "criminal" },
    { label: "Corporate", value: "corporate" },
  ]}
  value={selectedOptions}
  onChange={setSelectedOptions}
  placeholder="Choose categories..."
/>
👉 Explanation:

Multiple options can be chosen.

value is simply the array of chosen Options.

3. Async Search (server-side filtering)
Use case: searching thousands of records efficiently (delegated to backend).

tsx
Copy
Edit
<MultipleSelector
  options={[]}
  defaultOptions={[]}
  value={selected}
  onChange={setSelected}
  onSearch={async (query) => {
    const res = await fetch(`/api/courts?search=${query}`)
    const data = await res.json()
    return data.map((c: any) => ({ label: c.name, value: c.id }))
  }}
  placeholder="Type to search courts..."
/>
👉 Explanation:

No preloaded options.

Each keystroke triggers backend search.

4. Sync Search (client-side filtering)
Use case: filtering from a preloaded dataset (like 200 courts).

tsx
Copy
Edit
<MultipleSelector
  options={allCourts}
  defaultOptions={allCourts}
  value={selected}
  onChange={setSelected}
  onSearchSync={(query) =>
    allCourts.filter((o) =>
      o.label.toLowerCase().includes(query.toLowerCase())
    )
  }
  placeholder="Search courts..."
/>
👉 Explanation:

Filters results locally in the browser.

Best for up to a few hundred items.

5. Disabled Options
Use case: prevent certain items from being selectable.

tsx
Copy
Edit
<MultipleSelector
  options={[
    { label: "Civil", value: "civil" },
    { label: "Criminal", value: "criminal", disable: true },
  ]}
  value={selected}
  onChange={setSelected}
/>
👉 Explanation:

disable: true prevents interaction with the "Criminal" option.

Integration with React Hook Form (RHF)
Single Select (RHF controlled)
tsx
Copy
Edit
<FormField
  control={control}
  name="primaryCourt"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Primary Court</FormLabel>
      <FormControl>
        <MultipleSelector
          options={courtOptions}
          defaultOptions={courtOptions}
          value={field.value ? courtOptions.filter((c) => c.value === field.value) : []}
          onChange={(selected) =>
            field.onChange(selected.length > 0 ? selected[0].value : "")
          }
          maxSelected={1}
          placeholder="Select your primary court"
          emptyIndicator={<p className="text-sm text-center">No courts found</p>}
          onSearchSync={(query) =>
            courtOptions.filter((c) =>
              c.label.toLowerCase().includes(query.toLowerCase())
            )
          }
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
👉 Explanation:

We map field.value (string from RHF) into an array of matching Option.

On change, we set RHF’s value back to just the selected .value.

When to Use
✅ Use MultipleSelector for large datasets with search (courts, cities, laws, practice areas).

✅ Works well for both single and multiple select.

❌ Avoid it for very small option sets (2–5 items) → use a simpler Select instead.
```
