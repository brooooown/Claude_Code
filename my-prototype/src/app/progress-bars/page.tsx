"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle, AlertCircle, Clock, Zap } from "lucide-react";

// ─── Progress Bar Types ───

interface ProgressBarProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "success" | "warning" | "error" | "info";
  showLabel?: boolean;
  label?: string;
  className?: string;
}

// ─── Basic Progress Bar ───

function BasicProgressBar({
  value,
  max = 100,
  size = "md",
  variant = "default",
  showLabel = false,
  label,
  className = ""
}: ProgressBarProps) {
  const percentage = Math.min(Math.max(value, 0), max) / max * 100;

  const sizeClasses = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3"
  };

  const variantClasses = {
    default: "bg-primary",
    success: "bg-positive",
    warning: "bg-yellow-500",
    error: "bg-negative",
    info: "bg-info"
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-sm">
          <span className="text-text font-medium">{label}</span>
          <span className="text-text-sub">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={`w-full ${sizeClasses[size]} bg-bg-surface rounded-full overflow-hidden`}>
        <div
          className={`h-full ${variantClasses[variant]} transition-all duration-300 ease-out rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// ─── Circular Progress ───

function CircularProgress({
  value,
  max = 100,
  size = "md",
  variant = "default",
  showLabel = false,
  className = ""
}: ProgressBarProps) {
  const percentage = Math.min(Math.max(value, 0), max) / max * 100;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const sizes = {
    sm: { size: 60, stroke: 6 },
    md: { size: 80, stroke: 8 },
    lg: { size: 100, stroke: 10 }
  };

  const variantColors = {
    default: "#5C6AC4",
    success: "#55B762",
    warning: "#F59E0B",
    error: "#D24C3E",
    info: "#5C95F8"
  };

  const { size: svgSize, stroke } = sizes[size];

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative">
        <svg width={svgSize} height={svgSize} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r="45"
            stroke="currentColor"
            strokeWidth={stroke}
            fill="none"
            className="text-bg-surface"
          />
          {/* Progress circle */}
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r="45"
            stroke={variantColors[variant]}
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500 ease-out"
          />
        </svg>
        {showLabel && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-semibold text-text">
              {Math.round(percentage)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Step Progress ───

interface StepProgressProps {
  steps: Array<{ label: string; completed: boolean; current?: boolean }>;
  variant?: "horizontal" | "vertical";
  size?: "sm" | "md" | "lg";
  className?: string;
}

function StepProgress({ steps, variant = "horizontal", size = "md", className = "" }: StepProgressProps) {
  const iconSize = size === "sm" ? 16 : size === "md" ? 20 : 24;
  const stepSize = size === "sm" ? "w-6 h-6" : size === "md" ? "w-8 h-8" : "w-10 h-10";

  if (variant === "vertical") {
    return (
      <div className={`space-y-4 ${className}`}>
        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className={`${stepSize} rounded-full flex items-center justify-center text-sm font-semibold ${
              step.completed
                ? "bg-positive text-on-fill"
                : step.current
                  ? "bg-primary text-on-fill"
                  : "bg-bg-surface text-text-hint border-2 border-border"
            }`}>
              {step.completed ? (
                <CheckCircle size={iconSize} />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            <span className={`font-medium ${
              step.current ? "text-text" : step.completed ? "text-text" : "text-text-sub"
            }`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`flex items-center ${className}`}>
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div className={`${stepSize} rounded-full flex items-center justify-center text-sm font-semibold ${
            step.completed
              ? "bg-positive text-on-fill"
              : step.current
                ? "bg-primary text-on-fill"
                : "bg-bg-surface text-text-hint border-2 border-border"
          }`}>
            {step.completed ? (
              <CheckCircle size={iconSize} />
            ) : (
              <span>{index + 1}</span>
            )}
          </div>
          {index < steps.length - 1 && (
            <div className={`flex-1 mx-2 h-1 ${
              steps[index + 1].completed ? "bg-positive" : "bg-border"
            } rounded-full`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Loading Spinner ───

function LoadingSpinner({ size = "md", variant = "default", className = "" }: {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "success" | "warning" | "error" | "info";
  className?: string;
}) {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };

  const colors = {
    default: "text-primary",
    success: "text-positive",
    warning: "text-yellow-500",
    error: "text-negative",
    info: "text-info"
  };

  return (
    <div className={`${sizes[size]} ${colors[variant]} animate-spin ${className}`}>
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
}

// ─── Progress Card ───

interface ProgressCardProps {
  title: string;
  description?: string;
  value: number;
  max?: number;
  variant?: "default" | "success" | "warning" | "error" | "info";
  icon?: React.ReactNode;
  showPercentage?: boolean;
  className?: string;
}

function ProgressCard({
  title,
  description,
  value,
  max = 100,
  variant = "default",
  icon,
  showPercentage = true,
  className = ""
}: ProgressCardProps) {
  const percentage = Math.min(Math.max(value, 0), max) / max * 100;

  const variantClasses = {
    default: { bg: "bg-primary-tint", text: "text-primary", progress: "bg-primary" },
    success: { bg: "bg-positive-subtle", text: "text-positive", progress: "bg-positive" },
    warning: { bg: "bg-yellow-50", text: "text-yellow-700", progress: "bg-yellow-500" },
    error: { bg: "bg-negative-subtle", text: "text-negative", progress: "bg-negative" },
    info: { bg: "bg-info-subtle", text: "text-info", progress: "bg-info" }
  };

  const styles = variantClasses[variant];

  return (
    <div className={`p-4 rounded-lg border border-border ${styles.bg} ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {icon && <div className={styles.text}>{icon}</div>}
          <div>
            <h3 className="font-semibold text-text">{title}</h3>
            {description && (
              <p className="text-sm text-text-sub mt-1">{description}</p>
            )}
          </div>
        </div>
        {showPercentage && (
          <span className={`text-lg font-bold ${styles.text}`}>
            {Math.round(percentage)}%
          </span>
        )}
      </div>
      <div className="w-full h-2 bg-bg-surface rounded-full overflow-hidden">
        <div
          className={`h-full ${styles.progress} transition-all duration-300 ease-out rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// ─── Demo Data ───

const steps = [
  { label: "Account Setup", completed: true },
  { label: "Profile Information", completed: true },
  { label: "Verification", completed: false, current: true },
  { label: "Complete", completed: false }
];

const progressData = [
  { title: "Project Alpha", value: 75, variant: "success" as const, icon: <CheckCircle size={20} /> },
  { title: "Server Migration", value: 45, variant: "info" as const, icon: <Zap size={20} /> },
  { title: "Security Audit", value: 30, variant: "warning" as const, icon: <AlertCircle size={20} /> },
  { title: "System Backup", value: 90, variant: "default" as const, icon: <Clock size={20} /> }
];

// ─── Main Component ───

function ProgressBarsInner() {
  const searchParams = useSearchParams();
  const variant = searchParams.get("_v");
  const pattern = searchParams.get("_p") ?? "linear";

  return (
    <main className="max-w-4xl mx-auto px-4 py-6">
      {/* Back */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-text-sub hover:text-text mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> Back
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text mb-2">Progress Bar Components</h1>
        <p className="text-text-sub">Various progress indicators and loading states</p>
      </div>

      {/* Pattern: Linear Progress Bars */}
      {pattern === "linear" && (
        <div className="space-y-8">
          {/* Basic Linear Progress */}
          <section>
            <h2 className="text-xl font-semibold text-text mb-4">Linear Progress Bars</h2>
            <div className="grid gap-4">
              <div className="p-6 border border-border rounded-lg bg-bg">
                <h3 className="font-medium text-text mb-4">Basic Variants</h3>
                <div className="space-y-4">
                  <BasicProgressBar value={25} variant="default" showLabel label="Loading..." />
                  <BasicProgressBar value={50} variant="success" showLabel label="Success" />
                  <BasicProgressBar value={75} variant="warning" showLabel label="Warning" />
                  <BasicProgressBar value={90} variant="error" showLabel label="Error" />
                  <BasicProgressBar value={60} variant="info" showLabel label="Info" />
                </div>
              </div>

              <div className="p-6 border border-border rounded-lg bg-bg">
                <h3 className="font-medium text-text mb-4">Different Sizes</h3>
                <div className="space-y-4">
                  <BasicProgressBar value={40} size="sm" showLabel label="Small" />
                  <BasicProgressBar value={65} size="md" showLabel label="Medium" />
                  <BasicProgressBar value={80} size="lg" showLabel label="Large" />
                </div>
              </div>
            </div>
          </section>

          {/* Progress Cards */}
          <section>
            <h2 className="text-xl font-semibold text-text mb-4">Progress Cards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {progressData.map((item, index) => (
                <ProgressCard
                  key={index}
                  title={item.title}
                  description="Task in progress"
                  value={item.value}
                  variant={item.variant}
                  icon={item.icon}
                />
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Pattern: Circular Progress */}
      {pattern === "circular" && (
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-text mb-4">Circular Progress</h2>
            <div className="grid gap-6">
              <div className="p-6 border border-border rounded-lg bg-bg">
                <h3 className="font-medium text-text mb-6">Basic Circular Progress</h3>
                <div className="flex flex-wrap gap-8 justify-center">
                  <CircularProgress value={25} variant="default" showLabel />
                  <CircularProgress value={50} variant="success" showLabel />
                  <CircularProgress value={75} variant="warning" showLabel />
                  <CircularProgress value={90} variant="error" showLabel />
                </div>
              </div>

              <div className="p-6 border border-border rounded-lg bg-bg">
                <h3 className="font-medium text-text mb-6">Different Sizes</h3>
                <div className="flex flex-wrap gap-8 justify-center items-end">
                  <CircularProgress value={65} size="sm" variant="info" showLabel />
                  <CircularProgress value={65} size="md" variant="info" showLabel />
                  <CircularProgress value={65} size="lg" variant="info" showLabel />
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Pattern: Step Progress */}
      {pattern === "steps" && (
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-text mb-4">Step Progress</h2>
            <div className="grid gap-6">
              <div className="p-6 border border-border rounded-lg bg-bg">
                <h3 className="font-medium text-text mb-6">Horizontal Steps</h3>
                <StepProgress steps={steps} variant="horizontal" />
              </div>

              <div className="p-6 border border-border rounded-lg bg-bg">
                <h3 className="font-medium text-text mb-6">Vertical Steps</h3>
                <StepProgress steps={steps} variant="vertical" />
              </div>

              <div className="p-6 border border-border rounded-lg bg-bg">
                <h3 className="font-medium text-text mb-6">Different Sizes</h3>
                <div className="space-y-6">
                  <StepProgress steps={steps} size="sm" />
                  <StepProgress steps={steps} size="md" />
                  <StepProgress steps={steps} size="lg" />
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Pattern: Loading States */}
      {pattern === "loading" && (
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-text mb-4">Loading Spinners</h2>
            <div className="grid gap-6">
              <div className="p-6 border border-border rounded-lg bg-bg">
                <h3 className="font-medium text-text mb-6">Spinner Variants</h3>
                <div className="flex flex-wrap gap-8 items-center justify-center">
                  <div className="text-center">
                    <LoadingSpinner size="sm" variant="default" />
                    <p className="text-xs text-text-sub mt-2">Small</p>
                  </div>
                  <div className="text-center">
                    <LoadingSpinner size="md" variant="success" />
                    <p className="text-xs text-text-sub mt-2">Medium</p>
                  </div>
                  <div className="text-center">
                    <LoadingSpinner size="lg" variant="info" />
                    <p className="text-xs text-text-sub mt-2">Large</p>
                  </div>
                </div>
              </div>

              <div className="p-6 border border-border rounded-lg bg-bg">
                <h3 className="font-medium text-text mb-6">Loading States with Text</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <LoadingSpinner size="sm" variant="default" />
                    <span className="text-sm text-text-sub">Loading...</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <LoadingSpinner size="sm" variant="success" />
                    <span className="text-sm text-text-sub">Processing...</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <LoadingSpinner size="sm" variant="info" />
                    <span className="text-sm text-text-sub">Uploading...</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Indeterminate Progress */}
      {variant === "indeterminate" && (
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-text mb-4">Indeterminate Progress</h2>
            <div className="p-6 border border-border rounded-lg bg-bg">
              <div className="space-y-4">
                <div className="w-full h-2 bg-bg-surface rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: "40%" }} />
                </div>
                <div className="w-full h-2 bg-bg-surface rounded-full overflow-hidden">
                  <div className="h-full bg-info rounded-full animate-pulse" style={{ width: "60%" }} />
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Empty State */}
      {variant === "empty" && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-bg-surface flex items-center justify-center mb-4">
            <Clock size={24} className="text-text-hint" />
          </div>
          <h3 className="text-lg font-bold text-text mb-2">No Progress Data</h3>
          <p className="text-text-sub">Start a task to see progress indicators</p>
        </div>
      )}
    </main>
  );
}

export default function ProgressBarsPage() {
  return (
    <Suspense>
      <ProgressBarsInner />
    </Suspense>
  );
}