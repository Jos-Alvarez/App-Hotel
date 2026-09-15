'use client';

import { useChat } from 'ai/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEffect, useRef } from 'react';

export default function AdminChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-w-4xl mx-auto p-4">
      <Card className="flex-1 flex flex-col shadow-lg border-slate-200 bg-white">
        <CardHeader className="bg-slate-900 text-white rounded-t-xl pb-4">
          <CardTitle className="text-xl flex items-center gap-2">
            <span>✨</span> Asistente IA de Hot-el
          </CardTitle>
          <CardDescription className="text-slate-300">
            Pregúntame sobre ingresos, habitaciones disponibles, o reservas recientes.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden relative">
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.length === 0 && (
              <div className="text-center text-slate-400 mt-10">
                <p>Escribe tu primera pregunta abajo.</p>
                <p className="text-sm mt-2">Ejemplo: "¿Cuánto dinero hemos ganado en total?"</p>
              </div>
            )}
            
            <div className="space-y-4 pb-4">
              {messages.map(m => (
                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div 
                    className={`max-w-[85%] rounded-lg p-3 ${
                      m.role === 'user' 
                        ? 'bg-slate-900 text-white rounded-br-none' 
                        : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200'
                    }`}
                  >
                    <div className="font-semibold text-xs mb-1 opacity-70">
                      {m.role === 'user' ? 'Tú' : 'Asistente IA'}
                    </div>
                    <div className="text-sm whitespace-pre-wrap">
                      {m.content}
                      {m.toolInvocations?.map((toolInvocation, index) => (
                         <div key={index} className="mt-2 text-xs text-indigo-500 italic">
                           Consultando base de datos ({toolInvocation.toolName})...
                         </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-4 bg-slate-50 border-t flex gap-2 shrink-0">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Haz una pregunta sobre el hotel..."
              className="flex-1 focus-visible:ring-slate-900 bg-white"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !input.trim()} className="bg-slate-900 hover:bg-slate-800">
              {isLoading ? '...' : 'Enviar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
