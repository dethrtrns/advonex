
# MultipleSelector Component Usage Guide

## Introduction

The `MultipleSelector` is a versatile and customizable component for selecting multiple options from a list. It is built on top of `cmdk` and provides a rich set of features including asynchronous search, grouping, and creating new options.

## Installation

This component is part of the project's UI library and does not require separate installation.

## Importing

To use the `MultipleSelector` component, import it from its file path:

```tsx
import MultipleSelector from "@/components/ui/multiselect";
```

## The `Option` Interface

The `MultipleSelector` component works with an array of `Option` objects. Each option has the following structure:

```ts
export interface Option {
  value: string;
  label: string;
  disable?: boolean;
  /** fixed option that can't be removed. */
  fixed?: boolean;
  /** Group the options by providing key. */
  [key: string]: string | boolean | undefined;
}
```

-   `value`: A unique string identifier for the option.
-   `label`: The string that is displayed to the user.
-   `disable` (optional): A boolean to disable the option, making it unselectable.
-   `fixed` (optional): A boolean to make the option "fixed", meaning it cannot be removed once selected.
-   `[key: string]`: You can add any other string properties to the option object, which is useful for grouping.

## Props

The `MultipleSelector` component accepts the following props:

| Prop                        | Type                                    | Description                                                                                                                              |
| --------------------------- | --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `value`                     | `Option[]`                              | An array of selected `Option` objects. This makes the component controlled.                                                              |
| `defaultOptions`            | `Option[]`                              | An array of `Option` objects to be displayed by default.                                                                                 |
| `options`                   | `Option[]`                              | A manually controlled array of `Option` objects.                                                                                         |
| `placeholder`               | `string`                                | The placeholder text to be displayed when no options are selected.                                                                       |
| `loadingIndicator`          | `React.ReactNode`                       | A React node to be displayed when asynchronous search is in progress.                                                                    |
| `emptyIndicator`            | `React.ReactNode`                       | A React node to be displayed when there are no options to show.                                                                          |
| `delay`                     | `number`                                | The debounce time in milliseconds for asynchronous search. Only works with `onSearch`.                                                   |
| `triggerSearchOnFocus`      | `boolean`                               | When `true`, triggers the `onSearch` function on focus to get initial options.                                                           |
| `onSearch`                  | `(value: string) => Promise<Option[]>`  | An asynchronous function that takes a search string and returns a promise that resolves to an array of `Option` objects.                 |
| `onSearchSync`              | `(value: string) => Option[]`           | A synchronous function that takes a search string and returns an array of `Option` objects.                                              |
| `onChange`                  | `(options: Option[]) => void`           | A callback function that is called when the selected options change.                                                                     |
| `maxSelected`               | `number`                                | The maximum number of options that can be selected. Defaults to `Number.MAX_SAFE_INTEGER`.                                               |
| `onMaxSelected`             | `(maxLimit: number) => void`            | A callback function that is called when the user tries to select more options than `maxSelected`.                                        |
| `hidePlaceholderWhenSelected` | `boolean`                               | When `true`, hides the placeholder when at least one option is selected.                                                                 |
| `disabled`                  | `boolean`                               | When `true`, disables the component.                                                                                                     |
| `groupBy`                   | `string`                                | The key from the `Option` object to group the options by.                                                                                |
| `className`                 | `string`                                | Additional CSS classes for the component's container.                                                                                    |
| `badgeClassName`            | `string`                                | Additional CSS classes for the selected option badges.                                                                                   |
| `selectFirstItem`           | `boolean`                               | A workaround for `cmdk`'s default behavior of selecting the first item. Defaults to `true`.                                              |
| `creatable`                 | `boolean`                               | When `true`, allows the user to create new options that are not in the list.                                                             |
| `commandProps`              | `React.ComponentPropsWithoutRef<typeof Command>` | Props to be passed to the underlying `Command` component from `cmdk`.                                                              |
| `inputProps`                | `Omit<React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>, "value" | "placeholder" | "disabled">` | Props to be passed to the underlying `CommandPrimitive.Input` component. |
| `hideClearAllButton`        | `boolean`                               | When `true`, hides the "Clear all" button.                                                                                               |

## Example Usage

### Basic Usage

```tsx
import MultipleSelector from "@/components/ui/multiselect";
import { useState } from "react";

const options = [
  { value: "react", label: "React" },
  { value: "nextjs", label: "Next.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
  { value: "svelte", label: "Svelte" },
];

const MyComponent = () => {
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);

  return (
    <MultipleSelector
      defaultOptions={options}
      placeholder="Select your favorite frameworks"
      onChange={setSelectedOptions}
    />
  );
};
```

### Asynchronous Search

```tsx
import MultipleSelector from "@/components/ui/multiselect";
import { useState } from "react";

const MyComponent = () => {
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);

  const handleSearch = async (value: string) => {
    // Fetch options from an API
    const response = await fetch(`/api/frameworks?q=${value}`);
    const data = await response.json();
    return data.map((item: any) => ({ value: item.id, label: item.name }));
  };

  return (
    <MultipleSelector
      onSearch={handleSearch}
      placeholder="Search for frameworks..."
      loadingIndicator={<div>Loading...</div>}
      emptyIndicator={<div>No frameworks found.</div>}
      onChange={setSelectedOptions}
    />
  );
};
```

### Grouping Options

```tsx
import MultipleSelector from "@/components/ui/multiselect";
import { useState } from "react";

const options = [
  { value: "react", label: "React", group: "Frontend" },
  { value: "nextjs", label: "Next.js", group: "Frontend" },
  { value: "nodejs", label: "Node.js", group: "Backend" },
  { value: "express", label: "Express", group: "Backend" },
];

const MyComponent = () => {
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);

  return (
    <MultipleSelector
      defaultOptions={options}
      groupBy="group"
      placeholder="Select technologies"
      onChange={setSelectedOptions}
    />
  );
};
```

### Single Select with Search

While `MultipleSelector` is designed for multi-selection, you can easily configure it to behave like a single-select dropdown with search capabilities by setting the `maxSelected` prop to `1`.

```tsx
import MultipleSelector, { Option } from "@/components/ui/multiselect";
import { useState } from "react";

const options = [
  { value: "react", label: "React" },
  { value: "nextjs", label: "Next.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
  { value: "svelte", label: "Svelte" },
];

const MyComponent = () => {
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);

  const handleSelectionChange = (options: Option[]) => {
    setSelectedOption(options[0] || null);
  };

  return (
    <MultipleSelector
      defaultOptions={options}
      placeholder="Select a framework"
      maxSelected={1}
      onChange={handleSelectionChange}
      value={selectedOption ? [selectedOption] : []}
    />
  );
};
```

## Imperative Actions with `MultipleSelectorRef`

You can use a `ref` to access some imperative methods on the `MultipleSelector` component.

```ts
export interface MultipleSelectorRef {
  selectedValue: Option[];
  input: HTMLInputElement;
  focus: () => void;
  reset: () => void;
}
```

-   `selectedValue`: The currently selected `Option` objects.
-   `input`: The underlying `HTMLInputElement`.
-   `focus()`: Focuses the input element.
-   `reset()`: Resets the component to its initial state.

### Example with `ref`

```tsx
import MultiplereSelector, { MultipleSelectorRef } from "@/components/ui/multiselect";
import { useRef } from "react";

const MyComponent = () => {
  const multiSelectRef = useRef<MultipleSelectorRef>(null);

  return (
    <div>
      <MultipleSelector
        ref={multiSelectRef}
        defaultOptions={options}
        placeholder="Select options"
      />
      <button onClick={() => multiSelectRef.current?.focus()}>Focus</button>
      <button onClick={() => multiSelectRef.current?.reset()}>Reset</button>
    </div>
  );
};
```
