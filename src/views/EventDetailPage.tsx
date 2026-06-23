'use client';

import { motion } from 'motion/react';
import { Calendar, MapPin, Star, Clock, DollarSign, Share2, Heart, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { CategoryBadge } from '@/components/CategoryBadge';
import { formatDate, formatPrice } from '../lib/utils';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useMutation, useQuery } from '@tanstack/react-query';
import { confirmEventPresence, getEventById, getUserById } from '@/lib/api';
import { UserInitials } from '@/components/UserInitials';

export function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const { data: event, isLoading, isError } = useQuery({
    queryKey: ['events', id],
    queryFn: () => getEventById(id!),
    enabled: !!id,
  });

  const { data: organizer } = useQuery({
    queryKey: ['users', event?.organizerId],
    queryFn: () => getUserById(event!.organizerId),
    enabled: !!event?.organizerId,
  });

  const confirmMutation = useMutation({
    mutationFn: () => confirmEventPresence(event!.id),
    onSuccess: () => {
      setIsConfirmed(true);
      toast.success('Presença confirmada! Você receberá um email com os detalhes.');
    },
    onError: (error: Error) => {
      toast.error(`Não foi possível confirmar presença: ${error.message}`);
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 animate-pulse">Carregando evento...</Card>
      </div>
    );
  }

  if (isError || !event || !organizer) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="mb-4">Evento não encontrado</p>
          <Button variant="outline" onClick={() => router.push('/dashboard')}>
            Voltar para eventos
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para eventos
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="overflow-hidden">
                <div className="relative h-96">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <CategoryBadge category={event.category} />
                  </div>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={() => setIsFavorite(!isFavorite)}
                      className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform"
                    >
                      <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform">
                      <Share2 className="w-5 h-5 text-gray-700" />
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6">
                <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold">{event.rating}</span>
                    <span className="text-muted-foreground">({event.reviews} avaliações)</span>
                  </div>
                  <Badge variant="success">{event.status === 'upcoming' ? 'Em breve' : 'Acontecendo'}</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <InfoItem icon={<Calendar />} label="Data" value={formatDate(event.date)} />
                  <InfoItem icon={<Clock />} label="Horário" value={event.time} />
                  <InfoItem icon={<MapPin />} label="Local" value={event.location} />
                  <InfoItem icon={<DollarSign />} label="Preço" value={formatPrice(event.price)} />
                </div>

                <div className="mb-6">
                  <h3 className="font-bold mb-2">Sobre o Evento</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {event.description}
                  </p>
                </div>

              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6">
                <h3 className="font-bold mb-4">Organizador</h3>
                <div className="flex items-center gap-4">
                  <UserInitials name={organizer.name} size="md" />
                  <div className="flex-1">
                    <h4 className="font-bold">{organizer.name}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{organizer.bio}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{organizer.rating}</span>
                      </div>
                      <span className="text-muted-foreground">
                        {organizer.eventsCreated} eventos criados
                      </span>
                    </div>
                  </div>
                  <Button variant="outline">Seguir</Button>
                </div>
              </Card>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="p-6 sticky top-24">
                <div className="mb-6">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {formatPrice(event.price)}
                  </div>
                  <p className="text-sm text-muted-foreground">por participante</p>
                </div>

                <Button
                  className="w-full mb-3"
                  size="lg"
                  onClick={() => confirmMutation.mutate()}
                  disabled={isConfirmed || confirmMutation.isPending}
                  isLoading={confirmMutation.isPending}
                >
                  {isConfirmed ? '✓ Presença Confirmada' : 'Confirmar Presença'}
                </Button>

                <p className="text-xs text-center text-muted-foreground mb-6">
                  {isConfirmed
                    ? 'Você receberá um email com todos os detalhes'
                    : 'Você pode cancelar até 24h antes do evento'}
                </p>

                <div className="space-y-3 pt-6 border-t border-border">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Participantes</span>
                    <span className="font-medium">{event.confirmed}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Vagas restantes</span>
                    <span className="font-medium">{event.capacity - event.confirmed}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  );
}
