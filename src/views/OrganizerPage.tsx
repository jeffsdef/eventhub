'use client';

import { motion } from 'motion/react';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { events, users } from '@/data/mockData';
import { formatDate, formatPrice } from '../lib/utils';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export function OrganizerPage() {
  const router = useRouter();
  const organizer = users[0];
  const myEvents = events.filter(e => e.organizerId === organizer.id);

  const handleDeleteEvent = (eventId: number) => {
    toast.success('Evento excluído com sucesso!');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Painel do Organizador</h1>
            <p className="text-muted-foreground">
              Gerencie seus eventos e acompanhe métricas
            </p>
          </div>
          <Button size="lg" className="mt-4 md:mt-0">
            <Plus className="w-5 h-5" />
            Criar Evento
          </Button>
        </div>

        <Card className="overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="font-bold">Meus Eventos</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/30">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium">Evento</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">Data</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">Categoria</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">Participantes</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">Receita</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {myEvents.map((event, index) => (
                  <motion.tr
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <div className="font-medium line-clamp-1">{event.title}</div>
                          <div className="text-sm text-muted-foreground">
                            ⭐ {event.rating} ({event.reviews})
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {formatDate(event.date)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="primary">{event.category}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium">{event.confirmed}/{event.capacity}</div>
                        <div className="text-muted-foreground">
                          {((event.confirmed / event.capacity) * 100).toFixed(0)}%
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {formatPrice(event.price * event.confirmed)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="success">Ativo</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => router.push(`/event/${event.id}`)}
                          className="p-2 hover:bg-accent rounded-lg transition-colors"
                          title="Ver detalhes"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 hover:bg-accent rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

      </div>
    </div>
  );
}