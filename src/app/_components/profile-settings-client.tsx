"use client"

import { useState } from "react"
import { signOut } from "next-auth/react"
import {
  User,
  Bell,
  Heart,
  Shield,
  LogOut,
  Camera,
  Save,
  Trash2,
  AlertTriangle,
  Monitor,
  Smartphone,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../_components/ui/avatar"
import { Button } from "../_components/ui/button"
import { cn } from "../_lib/utils.lib"
import Link from "next/link"

interface SettingsUser {
  name?: string | null
  email?: string | null
  image?: string | null
  id?: string
}

interface SettingsClientProps {
  user: SettingsUser
}

type Tab = "profile" | "notifications" | "preferences" | "privacy" | "session"

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "profile", label: "Perfil", icon: User },
  { id: "notifications", label: "Notificações", icon: Bell },
  { id: "preferences", label: "Preferências", icon: Heart },
  { id: "privacy", label: "Privacidade", icon: Shield },
  { id: "session", label: "Sessão", icon: Monitor },
]

function SettingSection({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:gap-12">
      <div className="lg:w-64 lg:shrink-0">
        <h3 className="text-foreground text-sm font-semibold">{title}</h3>
        {description && (
          <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
            {description}
          </p>
        )}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  )
}

function SettingCard({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "border-border bg-card overflow-hidden rounded-2xl border",
        className,
      )}
    >
      {children}
    </div>
  )
}

function SettingRow({
  label,
  description,
  children,
  danger,
}: {
  label: string
  description?: string
  children?: React.ReactNode
  danger?: boolean
}) {
  return (
    <div
      className={cn(
        "border-border flex items-center justify-between gap-4 border-b px-5 py-4 last:border-0",
        danger && "bg-destructive/5",
      )}
    >
      <div className="min-w-0">
        <p
          className={cn(
            "text-sm font-medium",
            danger ? "text-destructive" : "text-foreground",
          )}
        >
          {label}
        </p>
        {description && (
          <p className="text-muted-foreground mt-0.5 text-xs">{description}</p>
        )}
      </div>
      {children && <div className="shrink-0">{children}</div>}
    </div>
  )
}

function Toggle({
  enabled,
  onChange,
}: {
  enabled: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={cn(
        "relative h-5 w-9 rounded-full transition-colors duration-200",
        enabled ? "bg-primary" : "bg-border",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200",
          enabled ? "translate-x-4" : "translate-x-0.5",
        )}
      />
    </button>
  )
}

function FieldInput({
  label,
  defaultValue,
  type = "text",
  placeholder,
}: {
  label: string
  defaultValue?: string
  type?: string
  placeholder?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-muted-foreground text-xs font-medium">
        {label}
      </label>
      <input
        type={type}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        className="border-border bg-background/50 text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:ring-primary/20 rounded-xl border px-3 py-2.5 text-sm transition-colors focus:ring-1 focus:outline-none"
      />
    </div>
  )
}

function ProfileTab({ user }: { user: SettingsUser }) {
  return (
    <div className="space-y-8">
      <SettingSection
        title="Foto de perfil"
        description="Sua foto é exibida no header e nos agendamentos."
      >
        <SettingCard>
          <div className="flex items-center gap-5 p-5">
            <div className="relative shrink-0">
              <Avatar className="ring-primary/20 ring-offset-card h-16 w-16 ring-2 ring-offset-2">
                {user.image ? (
                  <AvatarImage src={user.image} alt={user.name ?? ""} />
                ) : (
                  <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
                    {user.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <button className="border-border bg-card text-muted-foreground hover:text-primary absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full border transition-colors">
                <Camera className="h-3 w-3" />
              </button>
            </div>
            <div className="space-y-1">
              <p className="text-foreground text-sm font-medium">{user.name}</p>
              <p className="text-muted-foreground text-xs">{user.email}</p>
              <Button
                variant="secondary"
                size="sm"
                className="mt-2 h-7 rounded-lg px-3 text-xs"
              >
                Alterar foto
              </Button>
            </div>
          </div>
        </SettingCard>
      </SettingSection>

      <div className="bg-border h-px" />

      <SettingSection
        title="Informações pessoais"
        description="Atualize seu nome e e-mail de contato."
      >
        <SettingCard>
          <div className="flex flex-col gap-4 p-5">
            <FieldInput
              label="Nome completo"
              defaultValue={user.name ?? ""}
              placeholder="Seu nome"
            />
            <FieldInput
              label="E-mail"
              type="email"
              defaultValue={user.email ?? ""}
              placeholder="seu@email.com"
            />
          </div>
          <div className="border-border flex justify-end border-t px-5 py-3">
            <Button size="sm" className="gap-2 rounded-xl text-xs">
              <Save className="h-3.5 w-3.5" />
              Salvar alterações
            </Button>
          </div>
        </SettingCard>
      </SettingSection>

      <div className="bg-border h-px" />

      <SettingSection
        title="Senha"
        description="Mínimo de 8 caracteres. Deixe em branco para manter a atual."
      >
        <SettingCard>
          <div className="flex flex-col gap-4 p-5">
            <FieldInput
              label="Senha atual"
              type="password"
              placeholder="••••••••"
            />
            <FieldInput
              label="Nova senha"
              type="password"
              placeholder="••••••••"
            />
            <FieldInput
              label="Confirmar nova senha"
              type="password"
              placeholder="••••••••"
            />
          </div>
          <div className="border-border flex justify-end border-t px-5 py-3">
            <Button size="sm" className="gap-2 rounded-xl text-xs">
              <Save className="h-3.5 w-3.5" />
              Atualizar senha
            </Button>
          </div>
        </SettingCard>
      </SettingSection>
    </div>
  )
}

function NotificationsTab() {
  const [settings, setSettings] = useState({
    bookingReminder: true,
    bookingConfirmation: true,
    bookingCancellation: true,
    promotions: false,
    newBarbershops: false,
    weeklyDigest: false,
  })

  const set = (key: keyof typeof settings) => (v: boolean) =>
    setSettings((prev) => ({ ...prev, [key]: v }))

  return (
    <div className="space-y-8">
      <SettingSection
        title="Agendamentos"
        description="Notificações relacionadas aos seus horários."
      >
        <SettingCard>
          <SettingRow
            label="Lembrete de agendamento"
            description="Receba um lembrete 1 hora antes do horário."
          >
            <Toggle
              enabled={settings.bookingReminder}
              onChange={set("bookingReminder")}
            />
          </SettingRow>
          <SettingRow
            label="Confirmação de reserva"
            description="Notificação ao confirmar um novo agendamento."
          >
            <Toggle
              enabled={settings.bookingConfirmation}
              onChange={set("bookingConfirmation")}
            />
          </SettingRow>
          <SettingRow
            label="Cancelamentos"
            description="Aviso quando um agendamento for cancelado."
          >
            <Toggle
              enabled={settings.bookingCancellation}
              onChange={set("bookingCancellation")}
            />
          </SettingRow>
        </SettingCard>
      </SettingSection>

      <div className="bg-border h-px" />

      <SettingSection
        title="Marketing"
        description="Conteúdo promocional e novidades do app."
      >
        <SettingCard>
          <SettingRow
            label="Promoções e descontos"
            description="Ofertas especiais das barbearias que você frequenta."
          >
            <Toggle
              enabled={settings.promotions}
              onChange={set("promotions")}
            />
          </SettingRow>
          <SettingRow
            label="Novas barbearias"
            description="Quando uma barbearia nova abrir perto de você."
          >
            <Toggle
              enabled={settings.newBarbershops}
              onChange={set("newBarbershops")}
            />
          </SettingRow>
          <SettingRow
            label="Resumo semanal"
            description="Um e-mail por semana com as melhores opções."
          >
            <Toggle
              enabled={settings.weeklyDigest}
              onChange={set("weeklyDigest")}
            />
          </SettingRow>
        </SettingCard>
      </SettingSection>
    </div>
  )
}

function PreferencesTab() {
  const [city, setCity] = useState("")
  const [lang, setLang] = useState("pt-BR")
  const [favorites] = useState<string[]>([])

  return (
    <div className="space-y-8">
      <SettingSection
        title="Localização padrão"
        description="Usada para sugerir barbearias perto de você."
      >
        <SettingCard>
          <div className="p-5">
            <FieldInput
              label="Cidade ou região"
              defaultValue={city}
              placeholder="ex: Porto Alegre, RS"
            />
          </div>
          <div className="border-border flex justify-end border-t px-5 py-3">
            <Button size="sm" className="gap-2 rounded-xl text-xs">
              <Save className="h-3.5 w-3.5" />
              Salvar
            </Button>
          </div>
        </SettingCard>
      </SettingSection>

      <div className="bg-border h-px" />

      <SettingSection
        title="Idioma"
        description="Idioma de exibição do aplicativo."
      >
        <SettingCard>
          <div className="p-5">
            <label className="text-muted-foreground text-xs font-medium">
              Idioma
            </label>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="border-border bg-background/50 text-foreground focus:border-primary/40 mt-1.5 w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none"
            >
              <option value="pt-BR">Português (Brasil)</option>
              <option value="en-US">English (US)</option>
              <option value="es">Español</option>
            </select>
          </div>
        </SettingCard>
      </SettingSection>

      <div className="bg-border h-px" />

      <SettingSection
        title="Barbearias favoritas"
        description="Barbearias que você salvou para acesso rápido."
      >
        <SettingCard>
          {favorites.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <Heart className="text-muted-foreground/30 h-8 w-8" />
              <p className="text-muted-foreground text-sm">
                Nenhuma barbearia favorita ainda.
              </p>
              <Button
                asChild
                variant="secondary"
                size="sm"
                className="mt-1 rounded-xl text-xs"
              >
                <Link href="/barbershops">Explorar barbearias</Link>
              </Button>
            </div>
          ) : null}
        </SettingCard>
      </SettingSection>
    </div>
  )
}

function PrivacyTab() {
  const [settings, setSettings] = useState({
    publicProfile: false,
    saveHistory: true,
  })
  const set = (key: keyof typeof settings) => (v: boolean) =>
    setSettings((prev) => ({ ...prev, [key]: v }))

  return (
    <div className="space-y-8">
      <SettingSection
        title="Visibilidade"
        description="Controle quem pode ver seu perfil."
      >
        <SettingCard>
          <SettingRow
            label="Perfil público"
            description="Permite que outros usuários vejam seu perfil."
          >
            <Toggle
              enabled={settings.publicProfile}
              onChange={set("publicProfile")}
            />
          </SettingRow>
          <SettingRow
            label="Salvar histórico de navegação"
            description="Armazena barbearias visitadas para sugestões."
          >
            <Toggle
              enabled={settings.saveHistory}
              onChange={set("saveHistory")}
            />
          </SettingRow>
        </SettingCard>
      </SettingSection>

      <div className="bg-border h-px" />

      <SettingSection
        title="Seus dados"
        description="Gerencie as informações que armazenamos."
      >
        <SettingCard>
          <SettingRow
            label="Exportar meus dados"
            description="Baixe uma cópia de todos os seus dados."
          >
            <Button
              variant="secondary"
              size="sm"
              className="rounded-lg text-xs"
            >
              Exportar
            </Button>
          </SettingRow>
          <SettingRow
            label="Limpar histórico"
            description="Remove o histórico de navegação e buscas."
          >
            <Button
              variant="secondary"
              size="sm"
              className="hover:border-destructive/30 hover:text-destructive rounded-lg text-xs"
            >
              Limpar
            </Button>
          </SettingRow>
        </SettingCard>
      </SettingSection>

      <div className="bg-border h-px" />

      <SettingSection
        title="Zona de perigo"
        description="Ações irreversíveis relacionadas à sua conta."
      >
        <SettingCard>
          <SettingRow
            label="Excluir conta"
            description="Remove permanentemente sua conta e todos os dados."
            danger
          >
            <Button
              variant="secondary"
              size="sm"
              className="border-destructive/20 text-destructive hover:bg-destructive gap-1.5 rounded-lg text-xs hover:text-white"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Excluir
            </Button>
          </SettingRow>
        </SettingCard>
      </SettingSection>
    </div>
  )
}

function SessionTab() {
  const devices = [
    {
      name: "Chrome — Windows",
      icon: Monitor,
      location: "Porto Alegre, BR",
      current: true,
      time: "Agora",
    },
    {
      name: "Safari — iPhone",
      icon: Smartphone,
      location: "São Paulo, BR",
      current: false,
      time: "Há 2 dias",
    },
  ]

  return (
    <div className="space-y-8">
      <SettingSection
        title="Dispositivos ativos"
        description="Sessões abertas com sua conta."
      >
        <SettingCard>
          {devices.map((device, i) => (
            <div
              key={i}
              className="border-border flex items-center justify-between gap-4 border-b px-5 py-4 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-lg">
                  <device.icon className="text-primary h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-foreground text-sm font-medium">
                      {device.name}
                    </p>
                    {device.current && (
                      <span className="rounded-full bg-green-400/10 px-2 py-0.5 text-[10px] font-semibold text-green-400">
                        Este dispositivo
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {device.location} · {device.time}
                  </p>
                </div>
              </div>
              {!device.current && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="hover:border-destructive/30 hover:text-destructive rounded-lg text-xs"
                >
                  Encerrar
                </Button>
              )}
            </div>
          ))}
        </SettingCard>
      </SettingSection>

      <div className="bg-border h-px" />

      <SettingSection
        title="Encerrar sessões"
        description="Desconecte todos os dispositivos de uma vez."
      >
        <SettingCard>
          <SettingRow
            label="Sair de todos os dispositivos"
            description="Você será redirecionado para o login."
          >
            <Button
              variant="secondary"
              size="sm"
              className="gap-1.5 rounded-lg text-xs"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="h-3.5 w-3.5" />
              Sair de todos
            </Button>
          </SettingRow>
          <SettingRow
            label="Sair da conta"
            description="Encerrar apenas esta sessão."
            danger
          >
            <Button
              variant="secondary"
              size="sm"
              className="border-destructive/20 text-destructive hover:bg-destructive gap-1.5 rounded-lg text-xs hover:text-white"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              Sair
            </Button>
          </SettingRow>
        </SettingCard>
      </SettingSection>
    </div>
  )
}

export function ProfileSettingsClient({ user }: SettingsClientProps) {
  const [activeTab, setActiveTab] = useState<Tab>("profile")

  return (
    <div className="flex flex-col lg:flex-row">
      <nav className="border-border border-b lg:w-56 lg:shrink-0 lg:border-r lg:border-b-0">
        <div className="flex gap-1 overflow-x-auto px-5 py-3 lg:hidden">
          {tabs.map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors",
                activeTab === id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-primary/10 hover:text-primary",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </Button>
          ))}
        </div>

        <div className="hidden flex-col gap-1.5 p-4 lg:flex">
          {tabs.map(({ id, label, icon: Icon }) => (
            <Button
              variant="secondary"
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                "flex items-center justify-start gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors",
                activeTab === id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-primary/10 hover:text-primary",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
              {activeTab === id && (
                <span className="bg-primary ml-auto h-1.5 w-1.5 rounded-full" />
              )}
            </Button>
          ))}
        </div>
      </nav>

      <div className="flex-1 px-5 py-8 lg:px-10 xl:px-12">
        {activeTab === "profile" && <ProfileTab user={user} />}
        {activeTab === "notifications" && <NotificationsTab />}
        {activeTab === "preferences" && <PreferencesTab />}
        {activeTab === "privacy" && <PrivacyTab />}
        {activeTab === "session" && <SessionTab />}
      </div>
    </div>
  )
}
