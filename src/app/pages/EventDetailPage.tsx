import { motion } from 'motion/react';
import { Calendar, MapPin, Users, Star, Clock, DollarSign, Share2, Heart, ArrowLeft, Send } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { events, comments, users } from '../../data/mockData';
import { formatDate, formatPrice } from '../lib/utils';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { toast } from 'sonner';

export function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const event = events.find(e => e.id === Number(id));
  const eventComments = comments.filter(c => c.eventId === Number(id));
  const organizer = users.find(u => u.id === event?.organizerId);
  const relatedEvents = events.filter(e => e.category === event?.category && e.id !== event?.id).slice(0, 3);

  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(0);

  if (!event || !organizer) {
    return <div>Evento não encontrado</div>;
  }

  const handleConfirmPresence = () => {
    setIsConfirmed(true);
    toast.success('Presença confirmada! Você receberá um email com os detalhes.');
  };

  const handleSubmitComment = () => {
    if (newComment.trim() && rating > 0) {
      toast.success('Comentário enviado com sucesso!');
      setNewComment('');
      setRating(0);
    }
  };

  const occupancyPercentage = (event.confirmed / event.capacity) * 100;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para eventos
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
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
                    <Badge variant="primary">{event.category}</Badge>
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

            {/* Event Info */}
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

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Vagas Preenchidas</span>
                    <span className="text-sm text-muted-foreground">
                      {event.confirmed} / {event.capacity}
                    </span>
                  </div>
                  <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${occupancyPercentage}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className={`h-full ${
                        occupancyPercentage > 90 ? 'bg-destructive' :
                        occupancyPercentage > 70 ? 'bg-yellow-500' :
                        'bg-primary'
                      }`}
                    />
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Organizer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6">
                <h3 className="font-bold mb-4">Organizador</h3>
                <div className="flex items-center gap-4">
                  <img
                    src={organizer.avatar}
                    alt={organizer.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
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

            {/* Comments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6">
                <h3 className="font-bold mb-4">Comentários ({eventComments.length})</h3>

                {/* Add Comment */}
                <div className="mb-6 p-4 bg-muted/30 rounded-xl">
                  <div className="flex gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className="hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Deixe seu comentário..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <Button onClick={handleSubmitComment} disabled={!newComment.trim() || rating === 0}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                  {eventComments.map((comment) => (
                    <div key={comment.id} className="flex gap-4">
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
                              <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{comment.comment}</p>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(comment.date)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
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
                  onClick={handleConfirmPresence}
                  disabled={isConfirmed}
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
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Taxa de ocupação</span>
                    <Badge variant={occupancyPercentage > 90 ? 'danger' : 'success'}>
                      {occupancyPercentage.toFixed(0)}%
                    </Badge>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Related Events */}
            {relatedEvents.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="font-bold mb-4">Eventos Relacionados</h3>
                <div className="space-y-4">
                  {relatedEvents.map((relEvent) => (
                    <Card
                      key={relEvent.id}
                      hover
                      onClick={() => navigate(`/event/${relEvent.id}`)}
                      className="overflow-hidden cursor-pointer"
                    >
                      <div className="flex gap-3 p-3">
                        <img
                          src={relEvent.image}
                          alt={relEvent.title}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-2 mb-1">
                            {relEvent.title}
                          </h4>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {formatDate(relEvent.date)}
                          </div>
                          <div className="text-sm font-bold text-primary mt-1">
                            {formatPrice(relEvent.price)}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}
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
