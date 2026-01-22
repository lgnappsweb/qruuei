"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { Occurrence } from "@/lib/occurrences";

type OccurrenceCardProps = {
  occurrence: Occurrence;
};

export function OccurrenceCard({ occurrence }: OccurrenceCardProps) {
  const { toast } = useToast();
  const Icon = occurrence.icon;

  const handleClick = () => {
    // TODO: Futuramente, este clique poderá buscar e exibir
    // um relatório detalhado do Firestore e salvar a ocorrência.
    toast({
      title: "Ocorrência Selecionada",
      description: `Você selecionou: ${occurrence.title}`,
    });
  };

  return (
    <Card
      onClick={handleClick}
      className="bg-card hover:bg-accent/50 transition-colors duration-200 cursor-pointer group shadow-lg"
    >
      <CardContent className="flex flex-col items-center justify-center p-4 sm:p-6 gap-3 aspect-square">
        <div
          className={cn(
            "rounded-full p-4 transition-transform group-hover:scale-110",
            occurrence.color
          )}
        >
          <Icon className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
        </div>
        <p className="font-medium text-center text-lg text-card-foreground">
          {occurrence.title}
        </p>
      </CardContent>
    </Card>
  );
}
