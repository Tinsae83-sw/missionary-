'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, ArrowUpDown, Eye, Pencil, Trash2, Video, FileText } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import { format, formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

import { Sermon } from '../../../types/sermon';

// Extend the Sermon type to include frontend-specific properties
export interface FrontendSermon extends Omit<Sermon, 'sermon_date' | 'is_published' | 'is_featured' | 'view_count' | 'like_count' | 'share_count' | 'download_count'> {
  date: string;
  isPublished: boolean;
  isFeatured: boolean;
  viewCount: number;
  likeCount: number;
  shareCount: number;
  downloadCount: number;
  speakerName?: string;
  biblePassage?: string;
  videoUrl?: string;
  audioUrl?: string;
  sermonNotesUrl?: string;
  thumbnailUrl?: string;
  seriesName?: string;
}

export const columns: ColumnDef<FrontendSermon>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="p-0 hover:bg-transparent"
          style={{ color: '#0D47A1' }} // Dark Blue text
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" style={{ color: '#0D47A1' }} /> {/* Dark Blue icon */}
        </Button>
      );
    },
    cell: ({ row }) => {
      const sermon = row.original;
      const thumbnailUrl = sermon.thumbnail_url || sermon.thumbnailUrl;
      const speakerName = sermon.speakerName || sermon.speaker;
      const biblePassage = sermon.biblePassage || sermon.bible_passage || '';

      return (
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 h-12 w-20 rounded-md overflow-hidden" style={{ border: '1px solid #0D47A1' }}> {/* Dark Blue border */}
            {thumbnailUrl ? (
              <img
                src={thumbnailUrl}
                alt={sermon.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div 
                className="h-full w-full flex items-center justify-center"
                style={{ backgroundColor: '#E3F2FD' }} // Light Blue background
              >
                <FileText className="h-6 w-6" style={{ color: '#0D47A1' }} /> {/* Dark Blue icon */}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: '#0D47A1' }}> {/* Dark Blue text */}
              {sermon.title}
            </p>
            <p className="text-sm truncate" style={{ color: '#0D47A1', opacity: 0.8 }}> {/* Dark Blue text with opacity */}
              {speakerName} • {biblePassage}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'date',
    header: ({ column }) => {
      return (
        <div style={{ color: '#0D47A1' }}> {/* Dark Blue text */}
          Date
        </div>
      );
    },
    cell: ({ row }) => {
      const dateStr = row.getValue('date') as string;
      const date = new Date(dateStr);
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return <div className="text-sm" style={{ color: '#0D47A1', opacity: 0.8 }}>No date</div>; // Dark Blue text with opacity
      }
      
      return (
        <div className="text-sm">
          <div style={{ color: '#0D47A1' }}> {/* Dark Blue text */}
            {format(date, 'MMM d, yyyy')}
          </div>
          <div className="text-xs" style={{ color: '#0D47A1', opacity: 0.8 }}> {/* Dark Blue text with opacity */}
            {formatDistanceToNow(date, { addSuffix: true })}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'seriesName',
    header: ({ column }) => {
      return (
        <div style={{ color: '#0D47A1' }}> {/* Dark Blue text */}
          Series
        </div>
      );
    },
    cell: ({ row }) => {
      const seriesName = row.getValue('seriesName');
      return seriesName ? (
        <Badge 
          variant="outline" 
          className="whitespace-nowrap"
          style={{ 
            borderColor: '#0D47A1', // Dark Blue border
            color: '#0D47A1', // Dark Blue text
            backgroundColor: '#E3F2FD' // Light Blue background
          }}
        >
          {seriesName}
        </Badge>
      ) : (
        <span style={{ color: '#0D47A1', opacity: 0.8 }}>No series</span> // Dark Blue text with opacity
      );
    },
  },
  {
    accessorKey: 'view_count',
    header: ({ column }) => {
      return (
        <div style={{ color: '#0D47A1' }}> {/* Dark Blue text */}
          Views
        </div>
      );
    },
    cell: ({ row }) => {
      return <div className="text-sm" style={{ color: '#0D47A1' }}>{row.getValue('view_count')}</div>; // Dark Blue text
    },
  },
  {
    accessorKey: 'is_published',
    header: ({ column }) => {
      return (
        <div style={{ color: '#0D47A1' }}> {/* Dark Blue text */}
          Status
        </div>
      );
    },
    cell: ({ row }) => {
      const isPublished = row.getValue('is_published');
      return (
        <Badge 
          variant={isPublished ? 'default' : 'outline'}
          style={{
            backgroundColor: isPublished ? '#BBDEFB' : 'transparent', // Light Blue Accent for published, transparent for draft
            color: '#0D47A1', // Dark Blue text
            borderColor: '#0D47A1', // Dark Blue border for outline
          }}
        >
          {isPublished ? 'Published' : 'Draft'}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const sermon = row.original;

      return (
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="h-8 w-8 p-0"
            style={{ color: '#0D47A1' }} // Dark Blue icon
          >
            <Link href={`/sermons/${sermon.id}`} target="_blank">
              <Eye className="h-4 w-4" />
              <span className="sr-only">View</span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="h-8 w-8 p-0"
            style={{ color: '#0D47A1' }} // Dark Blue icon
          >
            <Link href={`/admin/sermons/${sermon.id}`}>
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="h-8 w-8 p-0"
                style={{ color: '#0D47A1' }} // Dark Blue icon
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end"
              style={{
                backgroundColor: '#E3F2FD', // Light Blue background
                border: '1px solid #0D47A1', // Dark Blue border
              }}
            >
              <DropdownMenuLabel style={{ color: '#0D47A1' }}> {/* Dark Blue text */}
                Actions
              </DropdownMenuLabel>
              <DropdownMenuSeparator style={{ backgroundColor: '#0D47A1' }} /> {/* Dark Blue separator */}
              <DropdownMenuItem asChild style={{ color: '#0D47A1' }}> {/* Dark Blue text */}
                <Link href={`/sermons/${sermon.id}`} className="cursor-pointer hover:bg-[#BBDEFB]">
                  <Eye className="mr-2 h-4 w-4" />
                  View on site
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild style={{ color: '#0D47A1' }}> {/* Dark Blue text */}
                <Link href={`/admin/sermons/${sermon.id}`} className="cursor-pointer hover:bg-[#BBDEFB]">
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator style={{ backgroundColor: '#0D47A1' }} /> {/* Dark Blue separator */}
              <DropdownMenuItem 
                className="focus:text-red-600"
                style={{ 
                  color: '#D32F2F', // Red for delete
                  backgroundColor: '#E3F2FD', // Light Blue background
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];