import { motion } from 'motion/react';
import { User, Mail, MapPin, Calendar, Settings, Edit, Star, Heart } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { users, events, categories } from '../../data/mockData';
import { formatDate, formatPrice } from '../lib/utils';
import { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const user = users[1];
  const navigate = useNavigate();

  const confirmedEvents = events.slice(0, 4);
  const pastEvents = events.slice(4, 7);

  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    bio: user.bio,
  });

  const handleSave = () => {
    toast.success('Perfil atualizado com sucesso!');
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="p-6">
                <div className="text-center">
                  <div className="relative inline-block mb-4">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-primary/10"
                    />
                    {isEditing && (
                      <button className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90">
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
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
                    {user.role === 'organizer' ? '📅 Organizador' : '👤 Participante'}
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
                      <Button onClick={handleSave} className="flex-1">
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
                  <InfoRow icon={<Calendar />} label="Membro desde" value="Janeiro 2024" />
                  <InfoRow icon={<MapPin />} label="Localização" value="São Paulo, SP" />
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6">
                <h3 className="font-bold mb-4">Interesses</h3>
                <div className="flex flex-wrap gap-2">
                  {user.interests.map((interest) => (
                    <Badge key={interest} variant="secondary">
                      {interest}
                    </Badge>
                  ))}
                </div>
                <Button variant="ghost" className="w-full mt-4" size="sm">
                  <Settings className="w-4 h-4" />
                  Gerenciar Interesses
                </Button>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6">
                <h3 className="font-bold mb-4">Estatísticas</h3>
                <div className="space-y-4">
                  <StatRow label="Eventos Participados" value={user.eventsAttended.toString()} />
                  <StatRow label="Eventos Organizados" value={user.eventsCreated.toString()} />
                  <StatRow label="Avaliações Feitas" value="23" />
                  <StatRow label="Seguidores" value="145" />
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Confirmed Events */}
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
                    <EventCard key={event.id} event={event} onClick={() => navigate(`/event/${event.id}`)} />
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Past Events */}
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
                      onClick={() => navigate(`/event/${event.id}`)}
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
                          <Badge variant="primary" className="text-xs">{event.category}</Badge>
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

            {/* Favorites */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Favoritos</h2>
                  <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {events.slice(0, 2).map((event) => (
                    <EventCard key={event.id} event={event} onClick={() => navigate(`/event/${event.id}`)} />
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

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-bold text-lg">{value}</span>
    </div>
  );
}

function EventCard({ event, onClick }: { event: any; onClick: () => void }) {
  return (
    <Card hover onClick={onClick} className="overflow-hidden">
      <div className="relative h-32">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge variant="primary" className="text-xs">{event.category}</Badge>
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
