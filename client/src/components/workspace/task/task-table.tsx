import { useState } from "react";
import { useParams } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getColumns } from "./table/columns";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import {
  useGetAllTasks,
  useGetMembersInWorkspace,
  useGetProjectsInWorkspace,
} from "@/hooks";
import type { Task } from "@/types/task.type";
import { DataTable } from "./table/data-table";
import { DataTableFacetedFilter } from "./table/table-faceted-filter";
import { priorities, statuses } from "./table/data";
import { getMemberOptions, getProjectOptions } from "@/hoc/options";
import { useTaskTableFilter } from "@/hooks/use-task-table-filter";

export type Filters = ReturnType<typeof useTaskTableFilter>[0];
type SetFilters = ReturnType<typeof useTaskTableFilter>[1];

interface DataTableFilterToolbarProps {
  isLoading?: boolean;
  projectId?: string;
  filters: Filters;
  setFilters: SetFilters;
}

export const TaskTable = () => {
  const param = useParams();
  const projectId = param.projectId as string;

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const columns = getColumns();
  const workspaceId = useWorkspaceId();
  const [filters, setFilters] = useTaskTableFilter();

  const { data, isLoading } = useGetAllTasks({
    workspaceId,
    projectId,
    pageSize,
    pageNumber,
    filters,
  });

  const tasks: Task[] = data?.data?.tasks || [];
  const totalCount = data?.data?.pagination.totalCount || 0;

  const handlePageChange = (page: number) => {
    setPageNumber(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
  };

  return (
    <div className='w-full relative'>
      <DataTable
        isLoading={isLoading}
        data={tasks}
        columns={columns}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        pagination={{ totalCount, pageNumber, pageSize }}
        filtersToolbar={
          <DataTableFilterToolbar
            isLoading={isLoading}
            projectId={projectId}
            filters={filters}
            setFilters={setFilters}
          />
        }
      />
    </div>
  );
};

const DataTableFilterToolbar = ({
  isLoading,
  projectId,
  filters,
  setFilters,
}: DataTableFilterToolbarProps) => {
  const workspaceId = useWorkspaceId();

  const { data } = useGetProjectsInWorkspace({ workspaceId });
  const { data: memberData } = useGetMembersInWorkspace({ workspaceId });

  const projects = data?.data?.projects || [];
  const members = memberData?.data?.members || [];

  const projectOptions = getProjectOptions(projects);
  const assigneesOptions = getMemberOptions(members);

  const handleFilterChange = (key: keyof Filters, values: string[]) => {
    setFilters({
      ...filters,
      [key]: values.length > 0 ? values.join(",") : null,
    });
  };

  return (
    <div className='flex flex-col lg:flex-row w-full items-start space-y-2 mb-2 lg:mb-0 lg:space-x-2  lg:space-y-0'>
      <Input
        placeholder='Filter tasks...'
        value={filters.keyword || ""}
        onChange={(e) =>
          setFilters({
            keyword: e.target.value,
          })
        }
        className='h-8 w-full lg:w-[250px]'
      />
      {/* Status filter */}
      <DataTableFacetedFilter
        title='Status'
        multiSelect={true}
        options={statuses}
        disabled={isLoading}
        selectedValues={filters.status?.split(",") || []}
        onFilterChange={(values: string[]) =>
          handleFilterChange("status", values)
        }
      />

      {/* Priority filter */}
      <DataTableFacetedFilter
        title='Priority'
        multiSelect={true}
        options={priorities}
        disabled={isLoading}
        selectedValues={filters.priority?.split(",") || []}
        onFilterChange={(values: string[]) =>
          handleFilterChange("priority", values)
        }
      />

      {/* Assigned To filter */}
      <DataTableFacetedFilter
        title='Assigned To'
        multiSelect={true}
        options={assigneesOptions}
        disabled={isLoading}
        selectedValues={filters.assignedTo?.split(",") || []}
        onFilterChange={(values: string[]) =>
          handleFilterChange("assignedTo", values)
        }
      />

      {!projectId && (
        <DataTableFacetedFilter
          title='Projects'
          multiSelect={false}
          options={projectOptions}
          disabled={isLoading}
          selectedValues={filters.projectId?.split(",") || []}
          onFilterChange={(values: string[]) =>
            handleFilterChange("projectId", values)
          }
        />
      )}

      {Object.values(filters).some(
        (value) => value !== null && value !== "",
      ) && (
        <Button
          disabled={isLoading}
          variant='ghost'
          className='h-8 px-2 lg:px-3'
          onClick={() =>
            setFilters({
              keyword: null,
              status: null,
              priority: null,
              projectId: null,
              assignedTo: null,
            })
          }
        >
          Reset
          <X className='w-4 h-4' />
        </Button>
      )}
    </div>
  );
};
