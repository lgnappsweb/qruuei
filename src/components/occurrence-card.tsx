"use client";

import { useRouter } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { Occurrence } from "@/lib/occurrences";

type OccurrenceCardProps = {
  occurrence: Occurrence;
};

export function OccurrenceCard({ occurrence }: OccurrenceCardProps) {
  const { toast } = useToast();
  const router = useRouter();
  const Icon = occurrence.icon;
  const isGradient = occurrence.color.includes('bg-gradient');

  const handleClick = () => {
    if (occurrence.id === '1') { // This is QUD RESGATE
      router.push('/ocorrencias/qud-resgate');
    } else if (occurrence.id === '2') { // This is QUD OPERAÇÃO
      router.push('/ocorrencias/qud-operacao');
    } else if (occurrence.id === '3') { // This is TRAÇADO DE PISTA
      router.push('/ocorrencias/tracado-de-pista');
    } else if (occurrence.id === '4') { // This is TO 01
      router.push('/ocorrencias/to01');
    } else if (occurrence.id === '5') { // This is TO 02
      router.push('/ocorrencias/to02');
    } else if (occurrence.id === '6') { // This is TO 03
      router.push('/ocorrencias/to03');
    } else if (occurrence.id === '7') { // This is TO 04
      router.push('/ocorrencias/to04');
    } else if (occurrence.id === '8') { // This is TO 05
      router.push('/ocorrencias/to05');
    } else if (occurrence.id === '9') { // This is TO 06
      router.push('/ocorrencias/to06');
    } else if (occurrence.id === '10') { // This is TO 07
      router.push('/ocorrencias/to07');
    } else if (occurrence.id === '11') { // This is TO 09
      router.push('/ocorrencias/to09');
    } else if (occurrence.id === '12') { // This is TO 11
      router.push('/ocorrencias/to11');
    } else if (occurrence.id === '13') { // This is TO 12
      router.push('/ocorrencias/to12');
    } else if (occurrence.id === '14') { // This is TO 15
      router.push('/ocorrencias/to15');
    } else if (occurrence.id === '15') { // This is TO 16
      router.push('/ocorrencias/to16');
    } else if (occurrence.id === '16') { // This is TO 17
      router.push('/ocorrencias/to17');
    } else if (occurrence.id === '17') { // This is TO 19
      router.push('/ocorrencias/to19');
    } else if (occurrence.id === '18') { // This is TO 32
      router.push('/ocorrencias/to32');
    } else if (occurrence.id === '19') { // This is TO 33
      router.push('/ocorrencias/to33');
    } else if (occurrence.id === '20') { // This is TO 34
      router.push('/ocorrencias/to34');
    } else if (occurrence.id === '21') { // This is TO 35
      router.push('/ocorrencias/to35');
    } else if (occurrence.id === '22') { // This is TO 37
      router.push('/ocorrencias/to37');
    } else if (occurrence.id === '23') { // This is TO 38
      router.push('/ocorrencias/to38');
    } else if (occurrence.id === '24') { // This is TO 39
      router.push('/ocorrencias/to39');
    } else if (occurrence.id === '25') { // This is TO 50
      router.push('/ocorrencias/to50');
    } else {
      // TODO: Futuramente, este clique poderá buscar e exibir
      // um relatório detalhado do Firestore e salvar a ocorrência.
      toast({
        title: "Página em construção",
        description: `A página para ${occurrence.title} ainda está em desenvolvimento.`,
      });
    }
  };

  return (
    <Card
      onClick={handleClick}
      className={cn(
        "hover:bg-accent transition-all duration-200 cursor-pointer group shadow-2xl dark:shadow-none"
      )}
    >
      <CardContent className="flex flex-col items-center justify-center p-4 sm:p-6 gap-3 h-40">
        <div
          className={cn(
            "rounded-full p-4 transition-transform group-hover:scale-110 shadow-xl dark:shadow-none",
            occurrence.color
          )}
        >
          <Icon className={cn("h-8 w-8", isGradient ? 'text-white' : 'text-black dark:text-primary-foreground')} />
        </div>
        <p
          className={cn(
            "font-condensed font-bold text-center text-card-foreground",
            occurrence.title.startsWith("TO") || occurrence.title.startsWith("QUD") ? "text-2xl" : "text-xl"
          )}
        >
          {occurrence.title}
        </p>
      </CardContent>
    </Card>
  );
}
