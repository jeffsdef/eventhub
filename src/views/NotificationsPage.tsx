'use client';

import { motion } from 'motion/react';
import { Bell } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { useEffect } from 'react';

export function NotificationsPage() {
  useEffect(() => {
    document.title = 'Notificações | EventHub';
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Bell className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Notificações</h1>
            <p className="text-muted-foreground">Acompanhe atualizações dos seus eventos</p>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold mb-2">Nenhuma notificação</h2>
            <p className="text-muted-foreground">
              Você não tem notificações no momento. Quando houver novidades, elas aparecerão aqui.
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
