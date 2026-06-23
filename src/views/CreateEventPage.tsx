'use client';

import { motion } from 'motion/react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  Image as ImageIcon,
  MapPin,
  Type,
  Users,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { CategorySelector } from '@/components/CategorySelector';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createEvent, getCategories, getCurrentUser } from '@/lib/api';
import { resolveCategories } from '@/lib/categories';
import { cn } from '@/lib/utils';

const createEventSchema = z.object({
  title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
  category: z.string().min(1, 'Selecione uma categoria'),
  date: z.string().min(1, 'Informe a data do evento'),
  time: z.string().optional(),
  location: z.string().min(3, 'Local deve ter no mínimo 3 caracteres'),
  description: z.string().optional(),
  price: z.coerce.number().min(0, 'Preço inválido').optional(),
  capacity: z.coerce.number().min(1, 'Capacidade mínima é 1').optional(),
  image: z
    .string()
    .optional()
    .refine((value) => !value || value.startsWith('http'), {
      message: 'Informe uma URL válida (http ou https)',
    }),
});

type CreateEventValues = z.infer<typeof createEventSchema>;

export function CreateEventPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: user, isLoading: loadingUser, isError: userError } = useQuery({
    queryKey: ['users', 'me'],
    queryFn: getCurrentUser,
  });

  const { data: apiCategories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const categories = resolveCategories(apiCategories);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateEventValues>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: '',
      category: '',
      date: '',
      time: '',
      location: '',
      description: '',
      price: 0,
      capacity: 100,
      image: '',
    },
  });

  const mutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: ['users', user.id, 'events'] });
      }
      toast.success('Evento criado com sucesso!');
      router.push('/organizer');
    },
    onError: (error: Error) => {
      toast.error(`Não foi possível criar o evento: ${error.message}`);
    },
  });

  useEffect(() => {
    document.title = 'Criar Evento | EventHub';
  }, []);

  const selectedCategory = watch('category');

  const onSubmit = (data: CreateEventValues) => {
    mutation.mutate({
      title: data.title,
      category: data.category,
      date: data.date,
      time: data.time || undefined,
      location: data.location,
      description: data.description || undefined,
      price: data.price ?? 0,
      capacity: data.capacity ?? 100,
      image: data.image || undefined,
    });
  };

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 animate-pulse">Carregando...</Card>
      </div>
    );
  }

  if (userError || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="mb-4">Faça login para criar eventos</p>
          <Button variant="outline" onClick={() => router.push('/login')}>
            Entrar
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          type="button"
          onClick={() => router.push('/organizer')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Meus Eventos
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Criar Evento</h1>
            <p className="text-muted-foreground">
              Preencha os dados abaixo para publicar seu evento na plataforma
            </p>
          </div>

          <Card className="p-6 sm:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <section className="space-y-4">
                <h2 className="text-lg font-bold">Informações básicas</h2>
                <Input
                  label="Título do evento"
                  icon={<Type className="w-4 h-4" />}
                  {...register('title')}
                  error={errors.title?.message}
                />
                <div className="w-full">
                  <label className="block text-sm font-medium mb-2 text-foreground">
                    Categoria
                  </label>
                  <CategorySelector
                    categories={categories}
                    selected={selectedCategory ? [selectedCategory] : []}
                    onToggle={(categoryName) =>
                      setValue('category', categoryName, { shouldValidate: true })
                    }
                    multiple={false}
                    columns={3}
                  />
                  {errors.category && (
                    <p className="mt-1.5 text-sm text-destructive">{errors.category.message}</p>
                  )}
                </div>
                <div className="w-full">
                  <label className="block text-sm font-medium mb-2 text-foreground">
                    Descrição
                  </label>
                  <textarea
                    {...register('description')}
                    className="w-full px-4 py-2.5 rounded-xl border border-input bg-input-background resize-none min-h-[120px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
                    rows={4}
                  />
                </div>
              </section>

              <section className="space-y-4 pt-6 border-t border-border">
                <h2 className="text-lg font-bold">Data e local</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Data"
                    type="date"
                    icon={<Calendar className="w-4 h-4" />}
                    {...register('date')}
                    error={errors.date?.message}
                  />
                  <Input
                    label="Horário"
                    type="time"
                    icon={<Clock className="w-4 h-4" />}
                    {...register('time')}
                    error={errors.time?.message}
                  />
                </div>
                <Input
                  label="Local"
                  icon={<MapPin className="w-4 h-4" />}
                  {...register('location')}
                  error={errors.location?.message}
                />
              </section>

              <section className="space-y-4 pt-6 border-t border-border">
                <h2 className="text-lg font-bold">Detalhes adicionais</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Preço (R$)"
                    type="number"
                    min={0}
                    step="0.01"
                    icon={<DollarSign className="w-4 h-4" />}
                    {...register('price')}
                    error={errors.price?.message}
                  />
                  <Input
                    label="Capacidade"
                    type="number"
                    min={1}
                    icon={<Users className="w-4 h-4" />}
                    {...register('capacity')}
                    error={errors.capacity?.message}
                  />
                </div>
                <Input
                  label="URL da imagem (opcional)"
                  type="url"
                  icon={<ImageIcon className="w-4 h-4" />}
                  {...register('image')}
                  error={errors.image?.message}
                />
              </section>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.push('/organizer')}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1" isLoading={mutation.isPending}>
                  Publicar Evento
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
