import { useState } from "react";
import { Eye, EyeOff, MessageCircle, Check, X, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";
import { useGameStore } from "@/store/gameStore";
import { CATEGORY_LABELS } from "@/data/gameData";
import type { Beast, OwnerStatement } from "@/types/game";

interface OwnerStatementPanelProps {
  beast: Beast;
}

export function OwnerStatementPanel({ beast }: OwnerStatementPanelProps) {
  const followUpQuestion = useGameStore(s => s.followUpQuestion);
  const toggleAcceptStatement = useGameStore(s => s.toggleAcceptStatement);
  const [expandedStatementId, setExpandedStatementId] = useState<string | null>(null);

  const { ownerStatement } = beast;
  const { statements, credibility, followUpCount, maxFollowUps, acceptedContent } = ownerStatement;

  const canFollowUp = followUpCount < maxFollowUps;

  const getCredibilityColor = (cred: number) => {
    if (cred >= 70) return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (cred >= 40) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-rose-600 bg-rose-50 border-rose-200";
  };

  const getCredibilityBarColor = (cred: number) => {
    if (cred >= 70) return "bg-emerald-500";
    if (cred >= 40) return "bg-amber-500";
    return "bg-rose-500";
  };

  const getCredibilityLabel = (cred: number) => {
    if (cred >= 80) return "非常可信";
    if (cred >= 60) return "比较可信";
    if (cred >= 40) return "半信半疑";
    if (cred >= 20) return "疑点重重";
    return "非常可疑";
  };

  const isAccepted = (stmt: OwnerStatement, isTruth: boolean) => {
    const key = `${stmt.id}-${isTruth ? 'truth' : 'lie'}`;
    return acceptedContent.includes(key);
  };

  const handleFollowUp = (stmt: OwnerStatement, questionIndex: number) => {
    if (!canFollowUp) return;
    if (stmt.revealedQuestions >= questionIndex + 1) return;
    followUpQuestion(beast.id, stmt.id, questionIndex);
  };

  const handleToggleAccept = (stmt: OwnerStatement, acceptTruth: boolean) => {
    const isCurrentlyAccepted = isAccepted(stmt, acceptTruth);
    toggleAcceptStatement(beast.id, stmt.id, !isCurrentlyAccepted);
  };

  return (
    <div className="mt-2 p-3 rounded-xl bg-gradient-to-br from-amber-50/80 to-rose-50/80 border border-amber-200/60 text-xs animate-fade">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-clinic-amber" />
          <span className="font-semibold text-clinic-deep">主人陈述</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`px-2 py-0.5 rounded-full border text-[10px] font-medium ${getCredibilityColor(credibility)}`}>
            可信度 {credibility}%
          </div>
          <div className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200 text-[10px] font-medium tabular-nums">
            追问 {followUpCount}/{maxFollowUps}
          </div>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between text-[10px] text-gray-500 mb-1">
          <span>{getCredibilityLabel(credibility)}</span>
          <span className="tabular-nums">{credibility}%</span>
        </div>
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${getCredibilityBarColor(credibility)}`}
            style={{ width: `${credibility}%` }}
          />
        </div>
      </div>

      {!canFollowUp && (
        <div className="mb-2 flex items-center gap-1.5 p-2 rounded-lg bg-amber-100/50 border border-amber-200 text-amber-700">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="text-[11px]">追问次数已用完，请根据现有信息判断</span>
        </div>
      )}

      <div className="space-y-2">
        {statements.map((stmt) => {
          const isExpanded = expandedStatementId === stmt.id;
          const hasTruth = stmt.isTruthRevealed;
          const lieAccepted = isAccepted(stmt, false);
          const truthAccepted = isAccepted(stmt, true);
          const nextQuestionIndex = stmt.revealedQuestions;
          const hasMoreQuestions = nextQuestionIndex < stmt.followUpQuestions.length;

          return (
            <div
              key={stmt.id}
              className={`rounded-lg border transition-all ${
                hasTruth
                  ? "border-emerald-300/50 bg-white/80"
                  : "border-gray-200 bg-white/60"
              } ${lieAccepted && !hasTruth ? "ring-2 ring-amber-400" : ""}
              ${truthAccepted ? "ring-2 ring-emerald-400" : ""}`}
            >
              <div
                className="p-2 cursor-pointer hover:bg-white/80 transition-colors"
                onClick={() => setExpandedStatementId(isExpanded ? null : stmt.id)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-clinic-deep">
                    {CATEGORY_LABELS[stmt.category]}
                  </span>
                  {hasTruth && (
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 border border-emerald-200 text-[9px] font-medium">
                      已揭示
                    </span>
                  )}
                  {isExpanded ? (
                    <ChevronUp className="w-3 h-3 text-gray-400 ml-auto" />
                  ) : (
                    <ChevronDown className="w-3 h-3 text-gray-400 ml-auto" />
                  )}
                </div>

                <div className="mt-1.5 space-y-1">
                  <div className={`flex items-start gap-1.5 ${lieAccepted && !hasTruth ? "text-amber-700 font-medium" : "text-gray-600"}`}>
                    <EyeOff className="w-3 h-3 flex-shrink-0 mt-0.5 text-gray-400" />
                    <span className="text-[11px] leading-relaxed">
                      「{stmt.initialStatement}」
                    </span>
                    {lieAccepted && !hasTruth && (
                      <Check className="w-3 h-3 text-amber-500 flex-shrink-0 mt-0.5" />
                    )}
                  </div>

                  {hasTruth && (
                    <div className={`flex items-start gap-1.5 ${truthAccepted ? "text-emerald-700 font-medium" : "text-emerald-600"}`}>
                      <Eye className="w-3 h-3 flex-shrink-0 mt-0.5 text-emerald-500" />
                      <span className="text-[11px] leading-relaxed">
                        💡 真相：「{stmt.truth}」
                      </span>
                      {truthAccepted && (
                        <Check className="w-3 h-3 text-emerald-500 flex-shrink-0 mt-0.5" />
                      )}
                    </div>
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="px-2 pb-2 pt-0 border-t border-gray-100 animate-fade">
                  <div className="mt-2 space-y-1">
                    <div className="text-[10px] text-gray-500 font-medium">追问问题：</div>
                    {stmt.followUpQuestions.map((question, qIndex) => {
                      const isRevealed = qIndex < stmt.revealedQuestions;
                      const isNext = qIndex === nextQuestionIndex && !isRevealed && hasMoreQuestions;

                      return (
                        <div
                          key={qIndex}
                          className={`flex items-center gap-1.5 p-1.5 rounded text-[11px] ${
                            isRevealed
                              ? "bg-gray-50 text-gray-400 line-through"
                              : isNext
                              ? "bg-amber-50 border border-amber-200 text-amber-800"
                              : "bg-gray-50/50 text-gray-500"
                          }`}
                        >
                          <span className="tabular-nums text-[10px] opacity-60">{qIndex + 1}.</span>
                          <span className="flex-1">{question}</span>
                          {isNext && canFollowUp && (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleFollowUp(stmt, qIndex); }}
                              className="px-2 py-0.5 rounded bg-amber-500 text-white text-[10px] font-medium hover:bg-amber-600 transition-colors"
                            >
                              追问
                            </button>
                          )}
                          {isRevealed && (
                            <Check className="w-3 h-3 text-gray-400" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <div className="text-[10px] text-gray-500 font-medium mb-1">采信判断：</div>
                    <div className="flex gap-1.5">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleToggleAccept(stmt, false); }}
                        className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded text-[10px] font-medium transition-all ${
                          lieAccepted && !hasTruth
                            ? "bg-amber-500 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-amber-100 hover:text-amber-700"
                        }`}
                      >
                        {lieAccepted && !hasTruth ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        采信陈述
                      </button>
                      {hasTruth && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleToggleAccept(stmt, true); }}
                          className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded text-[10px] font-medium transition-all ${
                            truthAccepted
                              ? "bg-emerald-500 text-white"
                              : "bg-gray-100 text-gray-600 hover:bg-emerald-100 hover:text-emerald-700"
                          }`}
                        >
                          {truthAccepted ? <Check className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          采信真相
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-2 pt-2 border-t border-amber-200/40 text-[10px] text-gray-500 italic">
        💡 提示：追问会消耗满意度但能提高可信度，可能揭示真相和隐藏症状。采信正确的真相有助于准确诊断！
      </div>
    </div>
  );
}
