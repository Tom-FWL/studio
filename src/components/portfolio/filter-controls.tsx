import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type FilterControlsProps = {
  categories: string[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
};

export function FilterControls({
  categories,
  activeCategory,
  setActiveCategory,
}: FilterControlsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-12">
      <Button
        variant={activeCategory === 'All' ? 'default' : 'outline'}
        onClick={() => setActiveCategory('All')}
        className={cn(
            'rounded-full transition-all duration-200',
            activeCategory === 'All' ? 'bg-primary text-primary-foreground' : 'bg-transparent'
        )}
      >
        All
      </Button>
      {categories.map((category) => (
        <Button
          key={category}
          variant={activeCategory === category ? 'default' : 'outline'}
          onClick={() => setActiveCategory(category)}
          className={cn(
            'rounded-full transition-all duration-200',
            activeCategory === category ? 'bg-primary text-primary-foreground' : 'bg-transparent'
          )}
        >
          {category}
        </Button>
      ))}
    </div>
  );
}
