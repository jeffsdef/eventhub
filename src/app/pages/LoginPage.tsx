import { motion } from 'motion/react';
import { Calendar, Mail, Lock, User, Github, Chrome } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { categories } from '../../data/mockData';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

const registerSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

export function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (isLogin) {
      toast.success('Login realizado com sucesso!');
      navigate('/dashboard');
    } else {
      if (step === 1) {
        setStep(2);
        setIsLoading(false);
        return;
      }
      toast.success('Conta criada com sucesso!');
      navigate('/dashboard');
    }
    setIsLoading(false);
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-secondary/5 to-background p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
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
            <Feature text="Mais de 1.000 eventos ativos" />
            <Feature text="45.000+ participantes ativos" />
            <Feature text="Avaliação 4.8 ⭐" />
            <Feature text="100% gratuito para participantes" />
          </div>
        </motion.div>

        {/* Right Side - Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">
                {isLogin ? 'Entrar na sua conta' : step === 1 ? 'Criar sua conta' : 'Selecione seus interesses'}
              </h2>
              <p className="text-muted-foreground">
                {isLogin ? 'Acesse sua conta para continuar' : step === 1 ? 'Preencha os dados para começar' : 'Personalize sua experiência'}
              </p>
            </div>

            {!isLogin && step === 2 ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Selecione suas categorias favoritas para receber recomendações personalizadas
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => toggleInterest(category.name)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedInterests.includes(category.name)
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="text-2xl mb-2">{category.icon}</div>
                      <div className="text-sm font-medium">{category.name}</div>
                    </button>
                  ))}
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1"
                  >
                    Voltar
                  </Button>
                  <Button
                    onClick={handleSubmit(onSubmit)}
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
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {!isLogin && (
                    <Input
                      label="Nome Completo"
                      placeholder="João Silva"
                      icon={<User className="w-4 h-4" />}
                      {...register('name')}
                      error={errors.name?.message as string}
                    />
                  )}

                  <Input
                    label="Email"
                    type="email"
                    placeholder="seu@email.com"
                    icon={<Mail className="w-4 h-4" />}
                    {...register('email')}
                    error={errors.email?.message as string}
                  />

                  <Input
                    label="Senha"
                    type="password"
                    placeholder="••••••••"
                    icon={<Lock className="w-4 h-4" />}
                    {...register('password')}
                    error={errors.password?.message as string}
                  />

                  {!isLogin && (
                    <Input
                      label="Confirmar Senha"
                      type="password"
                      placeholder="••••••••"
                      icon={<Lock className="w-4 h-4" />}
                      {...register('confirmPassword')}
                      error={errors.confirmPassword?.message as string}
                    />
                  )}

                  {isLogin && (
                    <div className="flex items-center justify-between text-sm">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded border-border" />
                        <span>Lembrar de mim</span>
                      </label>
                      <a href="#" className="text-primary hover:underline">
                        Esqueceu a senha?
                      </a>
                    </div>
                  )}

                  <Button type="submit" className="w-full" isLoading={isLoading}>
                    {isLogin ? 'Entrar' : 'Continuar'}
                  </Button>
                </form>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-card text-muted-foreground">
                      Ou continue com
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="w-full">
                    <Chrome className="w-4 h-4" />
                    Google
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Github className="w-4 h-4" />
                    GitHub
                  </Button>
                </div>

                <div className="text-center mt-6 text-sm">
                  <span className="text-muted-foreground">
                    {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setStep(1);
                    }}
                    className="ml-1 text-primary font-medium hover:underline"
                  >
                    {isLogin ? 'Cadastre-se' : 'Entrar'}
                  </button>
                </div>
              </>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function Feature({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
        <div className="w-2 h-2 rounded-full bg-primary"></div>
      </div>
      <span className="text-foreground">{text}</span>
    </div>
  );
}
