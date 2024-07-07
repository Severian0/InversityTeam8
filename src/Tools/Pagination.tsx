import type { ValidComponent } from "solid-js";
import { splitProps } from "solid-js";

import * as PaginationPrimitive from "@kobalte/core/pagination";
import { PolymorphicProps } from "@kobalte/core/polymorphic";

import { cn } from "../lib/utils";
import { buttonVariants } from "./Button";

const PaginationItems = PaginationPrimitive.Items;

type PaginationRootProps<T extends ValidComponent = "nav"> = any;

const Pagination = <T extends ValidComponent = "nav">(
  props: PolymorphicProps<T, PaginationRootProps<T>>,
) => {
  const [local, others] = splitProps(props as PaginationRootProps, [
    "class",
  ]) as any;
  return (
    <PaginationPrimitive.Root
      class={cn(
        "[&>*]:flex [&>*]:flex-row [&>*]:items-center [&>*]:gap-1",
        local.class,
      )}
      {...others}
    />
  );
};

type PaginationItemProps<T extends ValidComponent = "button"> = any;

const PaginationItem = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, PaginationItemProps<T>>,
) => {
  const [local, others] = splitProps(props as PaginationItemProps, [
    "class",
  ]) as any;
  return (
    <PaginationPrimitive.Item
      class={cn(
        buttonVariants({
          variant: "ghost",
        }),
        "size-10 data-[current]:border",
        local.class,
      )}
      {...others}
    />
  );
};

type PaginationEllipsisProps<T extends ValidComponent = "div"> = any;

const PaginationEllipsis = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, PaginationEllipsisProps<T>>,
) => {
  const [local, others] = splitProps(props as PaginationEllipsisProps, [
    "class",
  ]);
  return (
    <PaginationPrimitive.Ellipsis
      class={cn("flex size-10 items-center justify-center", local.class)}
      {...others}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="size-4"
      >
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
        <circle cx="5" cy="12" r="1" />
      </svg>
      <span class="sr-only">More pages</span>
    </PaginationPrimitive.Ellipsis>
  );
};

type PaginationPreviousProps<T extends ValidComponent = "button"> = any;

const PaginationPrevious = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, PaginationPreviousProps<T>>,
) => {
  const [local, others] = splitProps(props as PaginationPreviousProps, [
    "class",
  ]);
  return (
    <PaginationPrimitive.Previous
      class={cn(
        buttonVariants({
          variant: "ghost",
        }),
        "gap-1 pl-2.5",
        local.class,
      )}
      {...others}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="size-4"
      >
        <path d="M15 6l-6 6l6 6" />
      </svg>
      <span>Previous</span>
    </PaginationPrimitive.Previous>
  );
};

type PaginationNextProps<T extends ValidComponent = "button"> = any;

const PaginationNext = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, PaginationNextProps<T>>,
) => {
  const [local, others] = splitProps(props as PaginationNextProps, ["class"]);
  return (
    <PaginationPrimitive.Next
      class={cn(
        buttonVariants({
          variant: "ghost",
        }),
        "gap-1 pl-2.5",
        local.class,
      )}
      {...others}
    >
      <span>Next</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="size-4"
      >
        <path d="M9 6l6 6l-6 6" />
      </svg>
    </PaginationPrimitive.Next>
  );
};

export {
  Pagination,
  PaginationItems,
  PaginationItem,
  PaginationEllipsis,
  PaginationPrevious,
  PaginationNext,
};
