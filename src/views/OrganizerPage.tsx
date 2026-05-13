'use client';

import { motion } from 'motion/react';
import { Plus, Calendar, Users, TrendingUp, DollarSign, Edit, Trash2, Eye, MoreVertical } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { events, users } from '@/data/mockData';
import { formatDate, formatPrice } from '../lib/utils';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export function OrganizerPage() {
  const router = useRouter();
  const organizer = users[0];
  const myEvents = events.filter(e => e.organizerId === organizer.id);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const totalParticipants = myEvents.reduce((acc, e) => acc + e.confirmed, 0);
  const totalRevenue = myEvents.reduce((acc, e) => acc + (e.price * e.confirmed), 0);
  const avgRating = (myEvents.reduce((acc, e) => acc + e.rating, 0) / myEvents.length).toFixed(1);
  const avgOccupancy = ((myEvents.reduce((acc, e) => acc + (e.confirmed / e.capacity), 0) / myEvents.length) * 100).toFixed(0);

  const monthlyData = [
    { month: 'Jan', participants: 120, revenue: 15000 },
    { month: 'Fev', participants: 180, revenue: 22000 },
    { month: 'Mar', participants: 250, revenue: 31000 },
    { month: 'Abr', participants: 210, revenue: 26000 },
    { month: 'Mai', participants: 320, revenue: 42000 },
  ];

  const categoryData = [
    { name: 'Música', value: 5, color: '#2563EB' },
    { name: 'Educação', value: 3, color: '#8b5cf6' },
    { name: 'Esportes', value: 2, color: '#10b981' },
    { name: 'Arte', value: 2, color: '#f59e0b' },
  ];

  const handleDeleteEvent = (eventId: number) => {
    toast.success('Evento excluído com sucesso!');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Painel do Organizador</h1>
            <p className="text-muted-foreground">
              Gerencie seus eventos e acompanhe métricas
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)} size="lg" className="mt-4 md:mt-0">
            <Plus className="w-5 h-5" />
            Criar Evento
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Calendar className="w-6 h-6" />}
            label="Total de Eventos"
            value={myEvents.length.toString()}
            trend="+3 este mês"
            color="bg-primary"
          />
          <StatCard
            icon={<Users className="w-6 h-6" />}
            label="Total de Participantes"
            value={totalParticipants.toString()}
            trend="+12% vs mês anterior"
            color="bg-secondary"
          />
          <StatCard
            icon={<DollarSign className="w-6 h-6" />}
            label="Receita Total"
            value={formatPrice(totalRevenue)}
            trend="+8% vs mês anterior"
            color="bg-green-500"
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            label="Taxa de Ocupação"
            value={`${avgOccupancy}%`}
            trend={`Avaliação: ${avgRating} ⭐`}
            color="bg-yellow-500"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 lg:col-span-2">
            <h3 className="font-bold mb-4">Participantes & Receita (Últimos 5 meses)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Line type="monotone" dataKey="participants" stroke="#2563EB" strokeWidth={2} name="Participantes" />
                <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2} name="Receita (R$)" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold mb-4">Eventos por Categoria</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Events Table */}
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

        {/* Quick Stats Footer */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <h4 className="text-sm text-muted-foreground mb-2">Próximo Evento</h4>
            <p className="font-bold text-lg mb-1">{myEvents[0].title}</p>
            <p className="text-sm text-muted-foreground">{formatDate(myEvents[0].date)}</p>
          </Card>
          <Card className="p-6">
            <h4 className="text-sm text-muted-foreground mb-2">Evento Mais Popular</h4>
            <p className="font-bold text-lg mb-1">{myEvents.sort((a, b) => b.confirmed - a.confirmed)[0].title}</p>
            <p className="text-sm text-muted-foreground">{myEvents[0].confirmed} participantes</p>
          </Card>
          <Card className="p-6">
            <h4 className="text-sm text-muted-foreground mb-2">Melhor Avaliado</h4>
            <p className="font-bold text-lg mb-1">{myEvents.sort((a, b) => b.rating - a.rating)[0].title}</p>
            <p className="text-sm text-muted-foreground">⭐ {myEvents.sort((a, b) => b.rating - a.rating)[0].rating}</p>
          </Card>
        </div>
      </div>

      {/* Create Modal (simplified) */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-bold mb-4">Criar Novo Evento</h2>
            <p className="text-muted-foreground mb-6">
              Funcionalidade de criação em desenvolvimento. Use o botão abaixo para fechar.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowCreateModal(false)} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={() => {
                toast.success('Evento criado com sucesso!');
                setShowCreateModal(false);
              }} className="flex-1">
                Criar Evento
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, trend, color }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend: string;
  color: string;
}) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${color} text-white flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-sm text-muted-foreground mb-2">{label}</div>
      <div className="text-xs text-green-600 font-medium">{trend}</div>
    </Card>
  );
}
