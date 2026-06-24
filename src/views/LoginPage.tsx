'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Calendar, Mail, Lock, User } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';
import { getCategories, loginUser, registerUser } from '@/lib/api';
import { resolveCategories } from '@/lib/categories';
import { CategorySelector } from '@/components/CategorySelector';
import { LoginPayload } from '@/types';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

const registerSchema = z
  .object({
    name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

export function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const handleLogin = async (credentials: LoginPayload) => {
  try {
    await loginUser(credentials);
    
    router.push('/dashboard');
  } catch (error) {
    console.error("Erro no login:", error);
  }
  };

  useEffect(() => {
    document.title = 'Entrar | EventHub';
  }, []);

  const goDashboard = useCallback(() => {
    router.push('/dashboard');
  }, [router]);

  const featureItems = useMemo(
    () => [
      'Mais de 1.000 eventos ativos',
      '45.000+ participantes ativos',
      'Avaliação 4.8 ⭐',
      '100% gratuito para participantes',
    ],
    [],
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-secondary/5 to-background p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:block"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              EventHub
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Bem-vindo à maior plataforma de eventos do Brasil
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Descubra, participe e organize eventos incríveis na sua cidade.
          </p>
          <div className="space-y-4">
            {featureItems.map((text) => (
              <Feature key={text} text={text} />
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <Card className="p-8">
            {isLogin ? (
              <LoginCredentialsForm
                onSuccess={() => {
                  toast.success('Login realizado com sucesso!');
                  goDashboard();
                }}
                onSwitchToRegister={() => {
                  setIsLogin(false);
                }}
              />
            ) : (
              <RegisterFlow
                onSuccess={() => {
                  toast.success('Conta criada com sucesso!');
                  goDashboard();
                }}
                onSwitchToLogin={() => {
                  setIsLogin(true);
                }}
              />
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function LoginCredentialsForm({
  onSuccess,
  onSwitchToRegister,
}: {
  onSuccess: () => void;
  onSwitchToRegister: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginValues) => {
    setIsLoading(true);
    try {
      await loginUser({ email: data.email, password: data.password });
      onSuccess();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Falha ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Entrar na sua conta</h2>
        <p className="text-muted-foreground">Acesse sua conta para continuar</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="seu@email.com"
          icon={<Mail className="w-4 h-4" />}
          {...register('email')}
          error={errors.email?.message}
        />
        <Input
          label="Senha"
          type="password"
          placeholder="••••••••"
          icon={<Lock className="w-4 h-4" />}
          {...register('password')}
          error={errors.password?.message}
        />
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded border-border" />
            <span>Lembrar de mim</span>
          </label>
          <span className="text-primary">Esqueceu a senha?</span>
        </div>
        <Button type="submit" className="w-full" isLoading={isLoading}>
          Entrar
        </Button>
        <p className="text-xs text-center text-muted-foreground pt-1">
          Demo: maria@example.com / demo123
        </p>
      </form>
      <div className="text-center mt-6 text-sm">
        <span className="text-muted-foreground">Não tem uma conta?</span>
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="ml-1 text-primary font-medium hover:underline"
        >
          Cadastre-se
        </button>
      </div>
    </>
  );
}

function RegisterFlow({
  onSuccess,
  onSwitchToLogin,
}: {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [registerData, setRegisterData] = useState<RegisterValues | null>(null);

  const { data: apiCategories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const categories = resolveCategories(apiCategories);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmitStep1 = async (data: RegisterValues) => {
    setRegisterData(data);
    setStep(2);
  };

  const finishRegister = async () => {
    if (selectedInterests.length === 0) {
      toast.warning('Selecione ao menos um interesse para continuar.');
      return;
    }
    if (!registerData) return;

    setIsLoading(true);
    try {
      await registerUser({
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
        interests: selectedInterests,
      });
      await loginUser({
        email: registerData.email,
        password: registerData.password,
      });
      onSuccess();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Falha ao criar conta');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleInterest = (interest: string) => {
    if (!interest) return;
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest],
    );
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">
          {step === 1 ? 'Criar sua conta' : 'Selecione seus interesses'}
        </h2>
        <p className="text-muted-foreground">
          {step === 1 ? 'Preencha os dados para começar' : 'Personalize sua experiência'}
        </p>
      </div>

      {step === 2 ? (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground mb-4">
            Selecione suas categorias favoritas para receber recomendações personalizadas
          </p>
          <CategorySelector
            categories={categories}
            selected={selectedInterests}
            onToggle={toggleInterest}
            columns={3}
          />
          <div className="flex gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setStep(1)} className="flex-1">
              Voltar
            </Button>
            <Button
              type="button"
              onClick={finishRegister}
              isLoading={isLoading}
              className="flex-1"
              disabled={selectedInterests.length === 0}
            >
              Concluir Cadastro
            </Button>
          </div>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit(onSubmitStep1)} className="space-y-4">
            <Input
              label="Nome Completo"
              placeholder="João Silva"
              icon={<User className="w-4 h-4" />}
              {...register('name')}
              error={errors.name?.message}
            />
            <Input
              label="Email"
              type="email"
              placeholder="seu@email.com"
              icon={<Mail className="w-4 h-4" />}
              {...register('email')}
              error={errors.email?.message}
            />
            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              icon={<Lock className="w-4 h-4" />}
              {...register('password')}
              error={errors.password?.message}
            />
            <Input
              label="Confirmar Senha"
              type="password"
              placeholder="••••••••"
              icon={<Lock className="w-4 h-4" />}
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
            />
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Continuar
            </Button>
          </form>
        </>
      )}

      {step === 1 && (
        <div className="text-center mt-6 text-sm">
          <span className="text-muted-foreground">Já tem uma conta?</span>
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="ml-1 text-primary font-medium hover:underline"
          >
            Entrar
          </button>
        </div>
      )}
    </>
  );
}

function Feature({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
        <div className="w-2 h-2 rounded-full bg-primary" />
      </div>
      <span className="text-foreground">{text}</span>
    </div>
  );
}
