/* eslint-disable @typescript-eslint/no-explicit-any */
import { Check, PlusCircle } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

import { cn } from "@/lib/utils";

interface DataTableFacetedFilterProps {
  title?: string;
  options: {
    label: any;
    value: string;
    icon?: React.ComponentType<{ className?: string }> | any;
  }[];
  disabled?: boolean;
  multiSelect?: boolean;
  selectedValues: string[]; // New prop
  onFilterChange: (values: string[]) => void; // New callback prop
}

export function DataTableFacetedFilter({
  title,
  options,
  selectedValues = [],
  disabled,
  multiSelect = true,
  onFilterChange,
}: DataTableFacetedFilterProps) {
  const selectedValueSet = new Set(selectedValues);

  const [open, setOpen] = React.useState(false);

  const onClose = () => {
    setOpen(false);
  };

  return (
    <Popover modal={true} open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant="outline"
          size="sm"
          className="h-8 w-full border-dashed lg:w-auto"
        >
          <PlusCircle />
          {title}
          {selectedValueSet.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-0 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValueSet.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValueSet.size > 1 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValueSet.size}
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValueSet.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={`Filter ${title}`} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValueSet.has(option.value);
                return (
                  <CommandItem
                    className="cursor-pointer"
                    key={option.value}
                    onSelect={() => {
                      if (multiSelect) {
                        const updatedValues = isSelected
                          ? selectedValues.filter((val) => val !== option.value) // Remove value
                          : [...selectedValues, option.value]; // Add value
                        onFilterChange(updatedValues);
                      } else {
                        onFilterChange(isSelected ? [] : [option.value]); // Single select
                        onClose();
                      }
                    }}
                  >
                    {multiSelect && (
                      <div
                        className={cn(
                          "border-primary mr-2 flex h-4 w-4 items-center justify-center rounded-sm border",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50 [&_svg]:invisible",
                        )}
                      >
                        <Check />
                      </div>
                    )}
                    {option.icon && (
                      <option.icon className="text-muted-foreground mr-2 h-4 w-4" />
                    )}
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValueSet.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup className="sticky bottom-0 bg-white align-bottom">
                  <CommandItem
                    onSelect={() => onFilterChange([])} // Clear all filters
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
