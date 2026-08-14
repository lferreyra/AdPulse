# AdPulse Intelligence — Decisiones de Arquitectura

> Este documento registra las decisiones técnicas y de diseño clave, con sus justificaciones.
> Se mantiene vivo a lo largo del desarrollo.

---

## 1. Motor de Señales: función pura sin efectos secundarios

**Decisión**: `calculateSignal()` en `lib/signals/calculate-signal.ts` es una función pura (sin I/O, sin efectos).

**Justificación**:
- Testeable sin mocks (todos los tests son determinísticos).
- Reutilizable tanto en el cron de sincronización como en una futura edge function.
- Fácilmente auditable: cualquier cambio en las reglas se puede trazar con git.

**Límites exactos (documentados y testeados)**:
- `age < 30d` → Nuevo
- `age >= 30d AND ads > 80` → Escalado
- `age >= 30d AND 25 <= ads <= 80` → Escalando
- `age >= 30d AND 3 weekly snapshots AND variance <= 20%` → Asentado (por estabilidad)
- Fallback → Asentado (documentado, no inventado)

---

## 2. Supabase: RLS en todas las tablas + service role solo en server

**Decisión**: Habilitamos RLS en todas las tablas sin excepción. La service role key solo se usa en:
- `/api/cron/sync-meta` (protegido por CRON_SECRET)
- Admin API routes (verificadas con `isOwner()` server-side)
- Stripe webhook (firma HMAC obligatoria)

**Justificación**: Defense in depth. Un bug en el cliente nunca puede acceder a datos de otro usuario aunque envíe un booleano manipulado.

---

## 3. Filtros por URL params (no estado React)

**Decisión**: Los filtros de la biblioteca viven en searchParams de la URL, no en estado React.

**Justificación**:
- Shareable: un media buyer puede enviar la URL filtrada a su equipo.
- SEO-friendly (cuando aplica).
- Evita "flash" de filtros al navegar.
- Compatible con React `Suspense` y streaming.

---

## 4. Sin setInterval / timers en memoria

**Decisión**: La sincronización usa Vercel Cron (`vercel.json`), no timers en proceso.

**Justificación**: Los timers en memoria se pierden ante reinicios de serverless, leaks de memoria, y no escalan horizontalmente. El cron de Vercel es declarativo, monitoreable y reiniciable.

---

## 5. Paywall basado en `profiles.subscription_status` (server-side)

**Decisión**: `hasPro()` en `lib/supabase/server.ts` consulta la tabla `profiles` (no un claim de JWT).

**Justificación**: Los JWTs pueden quedar desactualizados. Consultar la DB en cada request server garantiza coherencia con el estado real de la suscripción. Se compensa con caché de datos en el `supabase.auth.getUser()`.

---

## 6. Meta Ads Library: validación con Zod + SSRF prevention

**Decisión**: Todas las respuestas de la Meta API se parsean con `MetaAdsResponseSchema` (Zod). Las URLs de snapshot se validan contra dominios de Facebook/CDN.

**Justificación**: La API externa puede cambiar formato. Zod falla rápido con mensajes claros. La validación de URLs previene que una respuesta maliciosa genere requests internos (SSRF).

---

## 7. Señales: 0 métricas inventadas

**Decisión**: No mostramos ROAS, conversiones, ingresos, ni ningún dato que Meta no provea directamente.

**Justificación (ética y legal)**: La Ads Library solo expone conteo de anuncios y rangos de impresiones. Inventar métricas sería misleading. La plataforma muestra solo lo observable y documenta el método de cálculo.

---

## 8. Modo Match: decisiones persistidas en `match_decisions`, no solo en favoritos

**Decisión**: Cada acción de Match (guardar/descartar) se persiste en `match_decisions`.

**Justificación**: Permite excluir productos ya decididos en futuras sesiones, implementar undo sin recargar la página, y auditar el comportamiento de usuarios para futuras features (feed personalizado, recomendaciones).

---

## 9. Admin: protección con `isOwner()` en layout server + API route

**Decisión**: El layout `/admin` hace `isOwner()` y redirige. Las API routes también verifican.

**Justificación**: Defense in depth. Si el middleware falla o es bypasseado, la segunda línea de defensa rechaza el request en la capa de lógica de negocio.

---

## 10. Formularios: validación Zod en cliente Y servidor

**Decisión**: Los formularios (ej: nuevo producto) validan con Zod en el cliente para UX rápida, y la API route vuelve a validar con el mismo schema.

**Justificación**: "Never trust the client" — la validación cliente es solo UX. La API siempre revalida para prevenir requests directos maliciosos.
