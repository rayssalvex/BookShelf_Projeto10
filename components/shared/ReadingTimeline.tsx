"use client";

import { motion } from "framer-motion";
import { Calendar, BookOpen, CheckCircle, Clock, Star } from "lucide-react";

interface TimelineEvent {
  id: string;
  type: 'added' | 'started' | 'progress' | 'finished' | 'rated';
  date: Date;
  description: string;
  details?: string;
  progress?: number;
  rating?: number;
}

interface ReadingTimelineProps {
  bookId: string;
  bookTitle: string;
  className?: string;
}

export default function ReadingTimeline({ 
  bookId, 
  bookTitle, 
  className = "" 
}: ReadingTimelineProps) {
  // Simular dados de timeline - em um app real, isso viria de uma API
  const timelineEvents: TimelineEvent[] = [
    {
      id: '1',
      type: 'added',
      date: new Date('2024-01-15'),
      description: 'Livro adicionado à biblioteca',
      details: 'Adicionado à lista "Quero ler"'
    },
    {
      id: '2',
      type: 'started',
      date: new Date('2024-01-20'),
      description: 'Iniciou a leitura',
      details: 'Status alterado para "Lendo"'
    },
    {
      id: '3',
      type: 'progress',
      date: new Date('2024-01-25'),
      description: 'Progresso atualizado',
      details: 'Página 150 de 300',
      progress: 50
    },
    {
      id: '4',
      type: 'progress',
      date: new Date('2024-02-01'),
      description: 'Progresso atualizado',
      details: 'Página 250 de 300',
      progress: 83
    },
    {
      id: '5',
      type: 'finished',
      date: new Date('2024-02-05'),
      description: 'Leitura concluída',
      details: 'Status alterado para "Lido"'
    },
    {
      id: '6',
      type: 'rated',
      date: new Date('2024-02-05'),
      description: 'Livro avaliado',
      details: 'Avaliação: 5 estrelas',
      rating: 5
    }
  ];

  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'added':
        return <BookOpen className="h-4 w-4" />;
      case 'started':
        return <Calendar className="h-4 w-4" />;
      case 'progress':
        return <Clock className="h-4 w-4" />;
      case 'finished':
        return <CheckCircle className="h-4 w-4" />;
      case 'rated':
        return <Star className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getEventColor = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'added':
        return 'bg-blue-500';
      case 'started':
        return 'bg-green-500';
      case 'progress':
        return 'bg-yellow-500';
      case 'finished':
        return 'bg-purple-500';
      case 'rated':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const calculateReadingTime = () => {
    const startEvent = timelineEvents.find(e => e.type === 'started');
    const finishEvent = timelineEvents.find(e => e.type === 'finished');
    
    if (startEvent && finishEvent) {
      const diffTime = finishEvent.date.getTime() - startEvent.date.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    
    return null;
  };

  const readingDays = calculateReadingTime();

  return (
    <div className={`bg-gray-800 rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Timeline de Leitura</h3>
        {readingDays && (
          <div className="text-sm text-gray-400">
            Lido em {readingDays} dia{readingDays > 1 ? 's' : ''}
          </div>
        )}
      </div>

      <div className="relative">
        {/* Linha vertical */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-600"></div>

        <div className="space-y-6">
          {timelineEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex items-start gap-4"
            >
              {/* Ícone do evento */}
              <div className={`
                relative z-10 flex items-center justify-center w-12 h-12 rounded-full text-white
                ${getEventColor(event.type)}
              `}>
                {getEventIcon(event.type)}
              </div>

              {/* Conteúdo do evento */}
              <div className="flex-1 min-w-0">
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-white">
                        {event.description}
                      </h4>
                      {event.details && (
                        <p className="text-sm text-gray-400 mt-1">
                          {event.details}
                        </p>
                      )}
                      
                      {/* Barra de progresso para eventos de progresso */}
                      {event.type === 'progress' && event.progress && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-600 rounded-full h-2">
                            <motion.div
                              className="bg-blue-500 h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${event.progress}%` }}
                              transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                            />
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {event.progress}% concluído
                          </div>
                        </div>
                      )}

                      {/* Estrelas para avaliação */}
                      {event.type === 'rated' && event.rating && (
                        <div className="flex items-center gap-1 mt-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= event.rating!
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-500'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <time className="text-xs text-gray-500 ml-4 whitespace-nowrap">
                      {formatDate(event.date)}
                    </time>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Estatísticas resumidas */}
      <div className="mt-6 pt-6 border-t border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-white">
              {timelineEvents.length}
            </div>
            <div className="text-xs text-gray-400">Eventos</div>
          </div>
          
          <div>
            <div className="text-lg font-semibold text-white">
              {readingDays || '-'}
            </div>
            <div className="text-xs text-gray-400">Dias lendo</div>
          </div>
          
          <div>
            <div className="text-lg font-semibold text-white">
              {timelineEvents.filter(e => e.type === 'progress').length}
            </div>
            <div className="text-xs text-gray-400">Atualizações</div>
          </div>
          
          <div>
            <div className="text-lg font-semibold text-white">
              {timelineEvents.find(e => e.type === 'rated')?.rating || '-'}
            </div>
            <div className="text-xs text-gray-400">Avaliação</div>
          </div>
        </div>
      </div>
    </div>
  );
}

