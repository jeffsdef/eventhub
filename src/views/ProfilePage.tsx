'use client';

import { motion } from 'motion/react';
import { Mail, Calendar, Edit, Star } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { CategoryBadge } from '@/components/CategoryBadge';
import { Input } from '../components/ui/Input';
import { formatDate, formatPrice } from '../lib/utils';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getCurrentUser,
  getUserConfirmedEvents,
  getUserPastEvents,
  updateCurrentUser,
} from '@/lib/api';
import type { Event } from '@/types';
import { UserInitials } from '@/components/UserInitials';

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['users', 'me'],
    queryFn: getCurrentUser,
  });

  const { data: confirmedEvents = [] } = useQuery({
    queryKey: ['users', 'me', 'events', 'confirmed'],
    queryFn: getUserConfirmedEvents,
    enabled: !!user,
  });

  const { data: pastEvents = [] } = useQuery({
    queryKey: ['users', 'me', 'events', 'past'],
    queryFn: getUserPastEvents,
    enabled: !!user,
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        bio: user.bio,
      });
    }
  }, [user]);

  const updateMutation = useMutation({
    mutationFn: () => updateCurrentUser(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
      toast.success('Perfil atualizado com sucesso!');
      setIsEditing(false);
    },
    onError: (error: Error) => {
      toast.error(`Não foi possível atualizar o perfil: ${error.message}`);
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 animate-pulse">Carregando perfil...</Card>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="mb-4">Não foi possível carregar o perfil</p>
          <Button variant="outline" onClick={() => router.push('/login')}>
            Fazer login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="p-6">
                <div className="text-center">
                  <div className="relative inline-block mb-4">
                    <UserInitials name={user.name} size="lg" className="mx-auto border-4 border-primary/10" />
                  </div>

                  {isEditing ? (
                    <div className="space-y-3 mb-4">
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                      <Input
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl border border-input bg-input-background resize-none"
                        rows={3}
                      />
                    </div>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
                      <p className="text-muted-foreground mb-4">{user.bio}</p>
                    </>
                  )}

                  <Badge variant="primary" className="mb-4">
                    📅 Organizador
                  </Badge>

                  <div className="flex items-center justify-center gap-1 mb-6">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold">{user.rating}</span>
                    <span className="text-muted-foreground text-sm">
                      ({user.eventsCreated} eventos)
                    </span>
                  </div>

                  {isEditing ? (
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                        Cancelar
                      </Button>
                      <Button
                        onClick={() => updateMutation.mutate()}
                        className="flex-1"
                        isLoading={updateMutation.isPending}
                      >
                        Salvar
                      </Button>
                    </div>
                  ) : (
                    <Button variant="outline" onClick={() => setIsEditing(true)} className="w-full">
                      <Edit className="w-4 h-4" />
                      Editar Perfil
                    </Button>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-border space-y-3">
                  <InfoRow icon={<Mail />} label="Email" value={user.email} />
                </div>
              </Card>
            </motion.div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Eventos Confirmados</h2>
                  <Badge variant="primary">{confirmedEvents.length}</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {confirmedEvents.map((event) => (
                    <EventCard key={event.id} event={event} onClick={() => router.push(`/event/${event.id}`)} />
                  ))}
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Histórico</h2>
                  <Badge variant="secondary">{pastEvents.length}</Badge>
                </div>
                <div className="space-y-4">
                  {pastEvents.map((event) => (
                    <div
                      key={event.id}
                      onClick={() => router.push(`/event/${event.id}`)}
                      className="flex gap-4 p-4 rounded-xl hover:bg-accent cursor-pointer transition-colors"
                    >
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold mb-1 line-clamp-1">{event.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <Calendar className="w-4 h-4" />
                          {formatDate(event.date)}
                        </div>
                        <div className="flex items-center gap-2">
                          <CategoryBadge category={event.category} className="text-xs" />
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{event.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="text-muted-foreground">{icon}</div>
      <div className="flex-1">
        <div className="text-muted-foreground">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  );
}

function EventCard({ event, onClick }: { event: Event; onClick: () => void }) {
  return (
    <Card hover onClick={onClick} className="overflow-hidden">
      <div className="relative h-32">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <CategoryBadge category={event.category} className="text-xs" />
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold mb-2 line-clamp-1">{event.title}</h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Calendar className="w-4 h-4" />
          {formatDate(event.date)}
        </div>
        <div className="flex items-center justify-between">
          <span className="font-bold text-primary">{formatPrice(event.price)}</span>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm">{event.rating}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
