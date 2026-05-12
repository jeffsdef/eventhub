import { motion } from 'motion/react';
import { Users, Calendar, TrendingUp, DollarSign, Shield, AlertTriangle, CheckCircle, XCircle, Search } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { platformStats, users, events, comments } from '../../data/mockData';
import { formatDate } from '../lib/utils';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from 'react';
import { toast } from 'sonner';

export function AdminPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState<'organizers' | 'events' | 'comments'>('organizers');

  const pendingOrganizers = users.filter(u => u.role === 'organizer').slice(0, 3);
  const recentEvents = events.slice(0, 5);
  const pendingComments = comments.slice(0, 4);

  const growthData = [
    { month: 'Jan', users: 38000, events: 980, revenue: 2100000 },
    { month: 'Fev', users: 40000, events: 1050, revenue: 2300000 },
    { month: 'Mar', users: 42000, events: 1120, revenue: 2500000 },
    { month: 'Abr', users: 44000, events: 1200, revenue: 2650000 },
    { month: 'Mai', users: 45632, events: 1247, revenue: 2800000 },
  ];

  const handleApproveOrganizer = (userId: number) => {
    toast.success('Organizador aprovado com sucesso!');
  };

  const handleRejectOrganizer = (userId: number) => {
    toast.error('Organizador rejeitado');
  };

  const handleApproveComment = (commentId: number) => {
    toast.success('Comentário aprovado');
  };

  const handleDeleteComment = (commentId: number) => {
    toast.error('Comentário removido');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Painel Administrativo</h1>
            <p className="text-muted-foreground">Gerencie e monitore a plataforma</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <AdminStatCard
            icon={<Users className="w-6 h-6" />}
            label="Total de Usuários"
            value={platformStats.totalUsers.toLocaleString('pt-BR')}
            trend={platformStats.growthRate}
            color="bg-primary"
          />
          <AdminStatCard
            icon={<Calendar className="w-6 h-6" />}
            label="Total de Eventos"
            value={platformStats.totalEvents.toLocaleString('pt-BR')}
            trend="+156 este mês"
            color="bg-secondary"
          />
          <AdminStatCard
            icon={<DollarSign className="w-6 h-6" />}
            label="Receita Total"
            value={platformStats.totalRevenue}
            trend={platformStats.growthRate}
            color="bg-green-500"
          />
          <AdminStatCard
            icon={<TrendingUp className="w-6 h-6" />}
            label="Avaliação Média"
            value={platformStats.averageRating.toString()}
            trend="⭐ Excelente"
            color="bg-yellow-500"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="font-bold mb-4">Crescimento de Usuários</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={growthData}>
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
                <Line type="monotone" dataKey="users" stroke="#2563EB" strokeWidth={2} name="Usuários" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold mb-4">Eventos Criados (Mensal)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={growthData}>
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
                <Bar dataKey="events" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Alerts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <AlertCard
            icon={<AlertTriangle className="w-5 h-5" />}
            label="Pendente Aprovação"
            value="12"
            color="bg-yellow-500"
          />
          <AlertCard
            icon={<Shield className="w-5 h-5" />}
            label="Comentários para Moderar"
            value="8"
            color="bg-blue-500"
          />
          <AlertCard
            icon={<Users className="w-5 h-5" />}
            label="Novos Organizadores"
            value="5"
            color="bg-green-500"
          />
        </div>

        {/* Tabs */}
        <Card className="overflow-hidden">
          <div className="border-b border-border">
            <div className="flex gap-4 px-6 py-4">
              <TabButton
                active={selectedTab === 'organizers'}
                onClick={() => setSelectedTab('organizers')}
              >
                Organizadores Pendentes
              </TabButton>
              <TabButton
                active={selectedTab === 'events'}
                onClick={() => setSelectedTab('events')}
              >
                Eventos Recentes
              </TabButton>
              <TabButton
                active={selectedTab === 'comments'}
                onClick={() => setSelectedTab('comments')}
              >
                Moderação de Comentários
              </TabButton>
            </div>
          </div>

          <div className="p-6">
            {selectedTab === 'organizers' && (
              <div className="space-y-4">
                <div className="mb-4">
                  <Input
                    placeholder="Buscar organizadores..."
                    icon={<Search className="w-4 h-4" />}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                {pendingOrganizers.map((organizer, index) => (
                  <motion.div
                    key={organizer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-xl border border-border hover:bg-accent/50 transition-colors"
                  >
                    <img
                      src={organizer.avatar}
                      alt={organizer.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-bold">{organizer.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{organizer.bio}</p>
                      <div className="flex items-center gap-3 text-sm">
                        <Badge variant="primary">{organizer.eventsCreated} eventos</Badge>
                        <span className="flex items-center gap-1">
                          ⭐ {organizer.rating}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleApproveOrganizer(organizer.id)}
                      >
                        <CheckCircle className="w-4 h-4" />
                        Aprovar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRejectOrganizer(organizer.id)}
                      >
                        <XCircle className="w-4 h-4" />
                        Rejeitar
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {selectedTab === 'events' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/30">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium">Evento</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Organizador</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Data</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Categoria</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Participantes</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {recentEvents.map((event, index) => (
                      <motion.tr
                        key={event.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-muted/20"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={event.image}
                              alt={event.title}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                            <span className="font-medium line-clamp-1">{event.title}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">{event.organizer}</td>
                        <td className="px-4 py-3 text-sm">{formatDate(event.date)}</td>
                        <td className="px-4 py-3">
                          <Badge variant="primary">{event.category}</Badge>
                        </td>
                        <td className="px-4 py-3 text-sm">{event.confirmed}/{event.capacity}</td>
                        <td className="px-4 py-3">
                          <Badge variant="success">Ativo</Badge>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {selectedTab === 'comments' && (
              <div className="space-y-4">
                {pendingComments.map((comment, index) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-xl border border-border"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <img
                        src={comment.userAvatar}
                        alt={comment.userName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{comment.userName}</span>
                          <div className="flex gap-0.5">
                            {[...Array(comment.rating)].map((_, i) => (
                              <span key={i}>⭐</span>
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{comment.comment}</p>
                        <span className="text-xs text-muted-foreground">
                          Evento ID: {comment.eventId} • {formatDate(comment.date)}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleApproveComment(comment.id)}
                      >
                        <CheckCircle className="w-4 h-4" />
                        Aprovar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        <XCircle className="w-4 h-4" />
                        Remover
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function AdminStatCard({ icon, label, value, trend, color }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend: string;
  color: string;
}) {
  return (
    <Card className="p-6">
      <div className={`w-12 h-12 rounded-xl ${color} text-white flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-sm text-muted-foreground mb-2">{label}</div>
      <div className="text-xs text-green-600 font-medium">{trend}</div>
    </Card>
  );
}

function AlertCard({ icon, label, value, color }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg ${color} text-white flex items-center justify-center`}>
          {icon}
        </div>
        <div>
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-sm text-muted-foreground">{label}</div>
        </div>
      </div>
    </Card>
  );
}

function TabButton({ active, onClick, children }: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors relative ${
        active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      {children}
      {active && (
        <motion.div
          layoutId="admin-tab-indicator"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
        />
      )}
    </button>
  );
}
