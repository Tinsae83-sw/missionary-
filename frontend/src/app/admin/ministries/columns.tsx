'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, ArrowUpDown } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import { Badge } from '../../../components/ui/badge';
import { formatDate } from '../../../lib/utils';
import Link from 'next/link';

// Define the table data type that matches our transformed data
type MinistryTableData = {
  id: string;
  name: string;
  description: string;
  shortDescription?: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone?: string;
  meetingTimes?: string;
  meetingLocation?: string;
  isActive: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
};

// Helper function to handle empty values with better styling
const formatValue = (value: any, defaultValue: string = '—') => {
  if (value === null || value === undefined || value === '') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted/20 text-muted-foreground">
        {defaultValue}
      </span>
    );
  }
  return value;
};

// Status badge component
const StatusBadge = ({ isActive }: { isActive: boolean }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
    isActive 
      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
  }`}>
    {isActive ? 'Active' : 'Inactive'}
  </span>
);

export const columns: ColumnDef<MinistryTableData>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <div className="flex items-center space-x-2">
        <span>Ministry Name</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-muted/50"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const name = row.getValue('name') as string;
      const id = row.original.id;
      const description = row.original.shortDescription || row.original.description;
      
      return (
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
            <span className="text-lg font-medium text-primary">
              {name ? name.charAt(0).toUpperCase() : 'M'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <Link 
              href={`/admin/ministries/${id}`} 
              className="text-sm font-medium text-foreground hover:text-primary transition-colors truncate block"
            >
              {formatValue(name, 'Unnamed Ministry')}
            </Link>
            {description && (
              <p className="text-xs text-muted-foreground truncate">
                {description}
              </p>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'contactInfo',
    header: 'Contact Info',
    cell: ({ row }) => {
      const contactPerson = row.original.contactPerson;
      const contactEmail = row.original.contactEmail;
      const contactPhone = row.original.contactPhone;
      
      return (
        <div className="space-y-1.5">
          <div className="font-medium text-sm">
            {formatValue(contactPerson, 'No contact')}
          </div>
          {contactEmail && (
            <a 
              href={`mailto:${contactEmail}`}
              className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <svg className="h-3.5 w-3.5 mr-1.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {contactEmail}
            </a>
          )}
          {contactPhone && (
            <a 
              href={`tel:${contactPhone}`}
              className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <svg className="h-3.5 w-3.5 mr-1.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {contactPhone}
            </a>
          )}
          {!contactEmail && !contactPhone && (
            <span className="text-xs text-muted-foreground/70">No contact info</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'meetingInfo',
    header: 'Meeting Info',
    cell: ({ row }) => {
      const meetingTimes = row.original.meetingTimes;
      const meetingLocation = row.original.meetingLocation;
      
      return (
        <div className="space-y-1.5">
          {meetingTimes ? (
            <div className="flex items-center text-sm">
              <svg className="h-3.5 w-3.5 mr-1.5 text-muted-foreground/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {meetingTimes}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground/70">No schedule</div>
          )}
          {meetingLocation ? (
            <div className="flex items-center text-sm">
              <svg className="h-3.5 w-3.5 mr-1.5 text-muted-foreground/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="truncate max-w-[180px]">{meetingLocation}</span>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground/70">No location</div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'displayOrder',
    header: 'Order',
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <span className="h-8 w-8 flex items-center justify-center rounded-full bg-muted/50 text-sm font-medium">
          {row.original.displayOrder || 0}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => (
      <StatusBadge isActive={row.original.isActive === 'Active'} />
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as string;
      return formatDate(date);
    },
  },
  {
    accessorKey: 'updatedAt',
    header: 'Last Updated',
    cell: ({ row }) => {
      const date = row.getValue('updatedAt') as string;
      return formatDate(date);
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const ministry = row.original;
 
      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full hover:bg-muted/50"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href={`/admin/ministries/${ministry.id}`} className="w-full cursor-pointer">
                  View/Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                {ministry.isActive === 'Active' ? 'Deactivate' : 'Activate'}
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
