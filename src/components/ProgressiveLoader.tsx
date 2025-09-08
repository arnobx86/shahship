import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';

interface ProgressiveLoaderProps {
  progress: number;
  currentStep: string;
  totalSteps: number;
}

export const ProgressiveLoader: React.FC<ProgressiveLoaderProps> = ({
  progress,
  currentStep,
  totalSteps,
}) => {
  const percentage = Math.round(progress * 100);

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="flex items-center gap-3 mb-4">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Loading data...</span>
              <span className="text-xs text-muted-foreground">
                {Math.min(Math.ceil(progress * totalSteps), totalSteps)}/{totalSteps}
              </span>
            </div>
            <Progress value={percentage} className="h-2" />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">{currentStep}</p>
      </CardContent>
    </Card>
  );
};

interface SkeletonGridProps {
  count: number;
  className?: string;
}

export const SkeletonGrid: React.FC<SkeletonGridProps> = ({ count, className = "" }) => {
  return (
    <div className={`grid gap-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="h-4 bg-muted animate-pulse rounded"></div>
              <div className="h-4 bg-muted animate-pulse rounded w-2/3"></div>
              <div className="h-4 bg-muted animate-pulse rounded w-1/2"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

interface SmartSkeletonProps {
  type: 'card' | 'table' | 'stats' | 'list';
  count?: number;
  className?: string;
}

export const SmartSkeleton: React.FC<SmartSkeletonProps> = ({
  type,
  count = 3,
  className = '',
}) => {
  switch (type) {
    case 'stats':
      return (
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
          {Array.from({ length: count }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="h-4 bg-muted animate-pulse rounded w-24"></div>
                  <div className="h-8 bg-muted animate-pulse rounded w-16"></div>
                  <div className="h-3 bg-muted animate-pulse rounded w-32"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    
    case 'table':
      return (
        <Card className={className}>
          <CardContent className="p-0">
            <div className="space-y-4 p-6">
              <div className="h-6 bg-muted animate-pulse rounded w-48"></div>
              <div className="space-y-3">
                {Array.from({ length: count }).map((_, i) => (
                  <div key={i} className="flex space-x-4">
                    <div className="h-4 bg-muted animate-pulse rounded flex-1"></div>
                    <div className="h-4 bg-muted animate-pulse rounded w-24"></div>
                    <div className="h-4 bg-muted animate-pulse rounded w-20"></div>
                    <div className="h-4 bg-muted animate-pulse rounded w-16"></div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      );
    
    case 'list':
      return (
        <div className={`space-y-3 ${className}`}>
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4 p-4 bg-muted/50 rounded">
              <div className="h-10 w-10 bg-muted animate-pulse rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted animate-pulse rounded w-3/4"></div>
                <div className="h-3 bg-muted animate-pulse rounded w-1/2"></div>
              </div>
              <div className="h-4 bg-muted animate-pulse rounded w-16"></div>
            </div>
          ))}
        </div>
      );
    
    default: // 'card'
      return <SkeletonGrid count={count} className={className} />;
  }
};