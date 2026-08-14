import { Badge } from "@/components/ui/badge";
import { SIGNAL_LABELS, type SignalLabel } from "@/lib/signals/calculate-signal";

interface SignalBadgeProps {
  signal: string | null;
}

export function SignalBadge({ signal }: SignalBadgeProps) {
  if (!signal) return <Badge variant="outline" className="text-muted-foreground">Desconocido</Badge>;

  switch (signal) {
    case SIGNAL_LABELS.NUEVO:
      return <Badge className="bg-blue-500/10 text-blue-700 hover:bg-blue-500/20 border-blue-500/20 shadow-none dark:text-blue-400">Nuevo</Badge>;
    case SIGNAL_LABELS.ESCALANDO:
      return <Badge className="bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 border-amber-500/20 shadow-none dark:text-amber-400">Escalando</Badge>;
    case SIGNAL_LABELS.ESCALADO:
      return <Badge className="bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 border-emerald-500/20 shadow-none dark:text-emerald-400">Escalado</Badge>;
    case SIGNAL_LABELS.ASENTADO:
      return <Badge className="bg-purple-500/10 text-purple-700 hover:bg-purple-500/20 border-purple-500/20 shadow-none dark:text-purple-400">Asentado</Badge>;
    default:
      return <Badge variant="outline">{signal}</Badge>;
  }
}
