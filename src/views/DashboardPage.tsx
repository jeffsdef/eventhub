'use client';

import { motion } from 'motion/react';
import { Search, Calendar, MapPin, Star } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { formatDate, formatPrice } from '../lib/utils';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { getCategories, getEvents } from '@/lib/api';
import type { Event } from '@/types';

export function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');
  const router = useRouter();

  const { data: eventsData = [], isLoading, isError, error } = useQuery({
    queryKey: ['events'],
    queryFn: getEvents,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  useEffect(() => {
    if (isError && error instanceof Error) {
      toast.error(`Não foi possível carregar os eventos: ${error.message}`);
    }
  }, [isError, error]);

  const filteredEvents = useMemo(() => {
    return eventsData.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || event.category === selectedCategory;
      const matchesPrice =
        priceFilter === 'all' ||
        (priceFilter === 'free' && event.price === 0) ||
        (priceFilter === 'paid' && event.price > 0);

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [eventsData, searchTerm, selectedCategory, priceFilter]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-4 sm:p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 min-w-0">
              <Input
                placeholder="Buscar eventos..."
                icon={<Search className="w-4 h-4" />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={priceFilter === 'all' ? 'primary' : 'outline'}
                onClick={() => setPriceFilter('all')}
                size="sm"
              >
                Todos
              </Button>
              <Button
                variant={priceFilter === 'free' ? 'primary' : 'outline'}
                onClick={() => setPriceFilter('free')}
                size="sm"
              >
                Gratuitos
              </Button>
              <Button
                variant={priceFilter === 'paid' ? 'primary' : 'outline'}
                onClick={() => setPriceFilter('paid')}
                size="sm"
              >
                Pagos
              </Button>
            </div>
          </div>

          <div className="mt-4 flex gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-xl text-sm transition-all ${
                selectedCategory === null
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-accent hover:bg-accent/80'
              }`}
            >
              Todas
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategory(category.name)}
                className={`px-4 py-2 rounded-xl text-sm transition-all flex items-center gap-2 ${
                  selectedCategory === category.name
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-accent hover:bg-accent/80'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </Card>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <EventSkeleton key={i} />
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <EmptyState
            onClear={() => {
              setSearchTerm('');
              setSelectedCategory(null);
              setPriceFilter('all');
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <EventCard event={event} onClick={() => router.push(`/event/${event.id}`)} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EventCard({ event, onClick }: { event: Event; onClick: () => void }) {
  return (
    <Card hover onClick={onClick} className="overflow-hidden group">
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <Badge variant="primary">{event.category}</Badge>
        </div>
        {event.featured && (
          <div className="absolute top-4 right-4">
            <Badge variant="warning">⭐ Destaque</Badge>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <div className="flex items-center gap-2 text-white text-sm">
            <Calendar className="w-4 h-4" />
            {formatDate(event.date)} às {event.time}
          </div>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{event.title}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{event.description}</p>
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{event.rating}</span>
            <span className="text-muted-foreground">({event.reviews})</span>
          </div>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <span className="font-bold text-primary text-lg">{formatPrice(event.price)}</span>
          <div className="text-sm">
            <span className="font-medium">{event.confirmed}</span>
            <span className="text-muted-foreground">/{event.capacity}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

function EventSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="h-48 bg-muted animate-pulse" />
      <div className="p-5 space-y-3">
        <div className="h-6 bg-muted animate-pulse rounded" />
        <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
        <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
        <div className="flex justify-between pt-4">
          <div className="h-6 bg-muted animate-pulse rounded w-20" />
          <div className="h-6 bg-muted animate-pulse rounded w-16" />
        </div>
      </div>
    </Card>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="text-center py-16 px-4">
      <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
        <Search className="w-12 h-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-bold mb-2">Nenhum evento encontrado</h3>
      <p className="text-muted-foreground mb-6">Tente ajustar seus filtros ou buscar por outros termos</p>
      <Button variant="outline" onClick={onClear}>
        Limpar Filtros
      </Button>
    </div>
  );
}
