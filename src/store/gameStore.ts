import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Beast,
  Bed,
  Staff,
  MedicalRecord,
  Transaction,
  BeastRelationship,
  Notification,
  DiseaseType,
  Severity,
  WeatherType,
  Prescription,
  TreatmentResult,
} from "@/types/game";
import {
  BREEDS,
  HERBS,
  PRESCRIPTIONS,
  INITIAL_STAFF,
  INITIAL_BEDS,
  DISEASE_SYMPTOMS,
  OWNER_NAMES,
  BEAST_NAMES,
  NOTES_SUCCESS,
  NOTES_FAIL,
  DISEASE_NAMES,
  FEEDING_STATEMENTS,
  INJURY_STATEMENTS,
  ONSET_STATEMENTS,
  CATEGORY_LABELS,
} from "@/data/gameData";
import type {
  OwnerStatement,
  OwnerStatementState,
  StatementCategory,
  FollowUpConsequence,
} from "@/types/game";

const DISEASE_TYPES: DiseaseType[] = [
  "fever", "cold", "poisoning", "fatigue", "fracture",
  "mana_disorder", "curse", "parasite", "dehydration", "allergy",
];

const SEVERITIES: { sev: Severity; hours: number }[] = [
  { sev: "mild", hours: 6 },
  { sev: "moderate", hours: 9 },
  { sev: "severe", hours: 12 },
  { sev: "critical", hours: 14 },
];

const WEATHERS: WeatherType[] = ["sunny", "cloudy", "rainy", "stormy", "misty"];

function uid(prefix = "id"): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateOwnerStatement(category: StatementCategory): OwnerStatement {
  const templates = {
    feeding: FEEDING_STATEMENTS,
    injury: INJURY_STATEMENTS,
    onset_time: ONSET_STATEMENTS,
  };
  const template = rand(templates[category]);
  return {
    id: uid("stmt"),
    category,
    initialStatement: template.lie,
    truth: template.truth,
    isTruthRevealed: false,
    followUpQuestions: template.questions,
    revealedQuestions: 0,
  };
}

function generateOwnerStatementState(): OwnerStatementState {
  const categories: StatementCategory[] = ["feeding", "injury", "onset_time"];
  const numStatements = randomInt(1, 3);
  const shuffled = [...categories].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, numStatements);

  const statements: OwnerStatement[] = selected.map(cat => generateOwnerStatement(cat));
  const baseCredibility = randomInt(40, 80);

  return {
    statements,
    credibility: baseCredibility,
    followUpCount: 0,
    maxFollowUps: statements.length * 3,
    acceptedContent: [],
  };
}

function getHiddenSymptomsForTruth(truth: string, allSymptoms: string[]): string[] {
  const symptomHints: Record<string, string[]> = {
    "中毒": ["呕吐", "腹泻", "口中异味", "瞳孔异常", "皮毛变色"],
    "骨折": ["肢体肿胀", "行动不便", "触碰尖叫", "骨骼异响", "无法站立"],
    "旧疾": ["体温偏高", "无精打采", "食欲不振", "嗜睡"],
    "寄生虫": ["瘙痒难忍", "皮毛脱落", "食量暴增但消瘦", "粪便异常"],
    "灵力紊乱": ["魔力溢出", "无意识施法", "元素暴走", "光环混乱"],
    "发烧": ["体温偏高", "鼻子发干", "魔力发热"],
    "脱水": ["口干舌燥", "皮肤弹性差", "尿液深黄", "眼窝凹陷"],
    "中毒草": ["呕吐", "口中异味", "瞳孔异常", "皮毛变色"],
    "过期丹药": ["魔力失控", "元素暴走", "无意识施法"],
    "污水": ["腹泻", "粪便异常", "呕吐", "皮肤凸起"],
    "斗兽场": ["肢体肿胀", "行动不便", "触碰尖叫", "无法站立"],
    "暗劲": ["魔力耗尽", "眼神空洞", "反应迟缓", "灵气暴走"],
    "虐待": ["触碰尖叫", "肢体肿胀", "行动不便", "皮肤凸起"],
    "拖延": ["体温偏高", "无精打采", "食欲不振", "嗜睡", "反应迟缓"],
  };

  const hidden: string[] = [];
  for (const [keyword, symptoms] of Object.entries(symptomHints)) {
    if (truth.includes(keyword)) {
      for (const sym of symptoms) {
        if (allSymptoms.includes(sym) && !hidden.includes(sym)) {
          hidden.push(sym);
        }
      }
    }
  }
  return hidden;
}

export function generateRandomBeast(day: number, time: number): Beast {
  const breed = rand(BREEDS.filter(b => b.rarity <= Math.min(5, 2 + Math.floor(day / 5))));
  const disease = rand(DISEASE_TYPES);
  const sevIdx = Math.min(3, Math.floor(Math.random() * Math.min(4, 1 + Math.floor(day / 4))));
  const severity = SEVERITIES[sevIdx].sev;
  const allSyms = DISEASE_SYMPTOMS[disease];
  const ownerStatement = generateOwnerStatementState();

  const revealedSymCount = randomInt(2, 3);
  const revealedSyms: string[] = [];
  while (revealedSyms.length < revealedSymCount) {
    const s = rand(allSyms);
    if (!revealedSyms.includes(s)) revealedSyms.push(s);
  }

  return {
    id: uid("beast"),
    breedId: breed.id,
    name: rand(BEAST_NAMES),
    age: randomInt(1, 10),
    stage: 0,
    disease,
    severity,
    symptoms: revealedSyms,
    allSymptoms: allSyms,
    trustLevel: randomInt(0, 20),
    waitHours: 0,
    satisfaction: 100,
    ownerName: rand(OWNER_NAMES),
    arrivedAt: time,
    ownerStatement,
  };
}

function calcTreatmentHours(severity: Severity, staffBoost: boolean): number {
  const base = SEVERITIES.find(s => s.sev === severity)?.hours ?? 8;
  return staffBoost ? Math.ceil(base * 0.7) : base;
}

export function guessDiseaseFromSymptoms(symptoms: string[]): { disease: DiseaseType; matchRate: number }[] {
  const results: { disease: DiseaseType; matchRate: number }[] = [];
  for (const disease of DISEASE_TYPES) {
    const diseaseSyms = DISEASE_SYMPTOMS[disease];
    const matched = symptoms.filter(s => diseaseSyms.includes(s)).length;
    const matchRate = Math.floor((matched / symptoms.length) * 100);
    results.push({ disease, matchRate });
  }
  return results.sort((a, b) => b.matchRate - a.matchRate);
}

export interface GameState {
  money: number;
  reputation: number;
  currentDay: number;
  currentTime: number;
  weather: WeatherType;
  isPaused: boolean;
  speed: number;
  waitingQueue: Beast[];
  beds: Bed[];
  inventory: Record<string, number>;
  staff: Staff[];
  discoveredBreeds: string[];
  medicalRecords: MedicalRecord[];
  beastRelationships: Record<string, BeastRelationship>;
  transactions: Transaction[];
  notifications: Notification[];
  selectedBeastId: string | null;
  selectedBedId: string | null;
  lastBeastSpawn: number;

  // Actions
  togglePause: () => void;
  setSpeed: (s: number) => void;
  selectBeast: (id: string | null) => void;
  selectBed: (id: string | null) => void;
  dismissBeast: (id: string) => void;
  assignBedAndTreat: (beastId: string, bedId: string, staffId: string | null, herbIds: string[], playerDiagnosis: DiseaseType | null) => void;
  purchaseHerb: (herbId: string, qty: number) => void;
  collectFromBed: (bedId: string) => void;
  addNotification: (type: Notification["type"], message: string) => void;
  clearNotification: (id: string) => void;
  resetGame: () => void;
  tickGame: (steps?: number) => void;
  followUpQuestion: (beastId: string, statementId: string, questionIndex: number) => void;
  toggleAcceptStatement: (beastId: string, statementId: string, accept: boolean) => void;
  _spawnInitialBeasts: () => void;
  _addTransaction: (type: Transaction["type"], category: string, amount: number, description: string) => void;
  _dailySettlement: () => void;
}

function createInitialBeds(): Bed[] {
  return INITIAL_BEDS.map(b => ({
    id: b.id,
    name: b.name,
    status: "empty",
    assignedBeastId: null,
    assignedStaffId: null,
    treatmentProgress: 0,
    treatmentTotal: 0,
    result: "pending",
    currentPrescriptionHerbs: [],
    playerDiagnosis: null,
    startedAt: null,
    beastSnapshot: null,
  }));
}

function createInitialInventory(): Record<string, number> {
  const inv: Record<string, number> = {};
  HERBS.forEach(h => { inv[h.id] = 5; });
  return inv;
}

function buildInitialState() {
  return {
    money: 500,
    reputation: 50,
    currentDay: 1,
    currentTime: 8,
    weather: "sunny" as WeatherType,
    isPaused: false,
    speed: 1,
    waitingQueue: [] as Beast[],
    beds: createInitialBeds(),
    inventory: createInitialInventory(),
    staff: JSON.parse(JSON.stringify(INITIAL_STAFF)),
    discoveredBreeds: [] as string[],
    medicalRecords: [] as MedicalRecord[],
    beastRelationships: {} as Record<string, BeastRelationship>,
    transactions: [] as Transaction[],
    notifications: [] as Notification[],
    selectedBeastId: null,
    selectedBedId: null,
    lastBeastSpawn: 8,
  };
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...buildInitialState(),

      togglePause: () => set(s => ({ isPaused: !s.isPaused })),
      setSpeed: (s: number) => set({ speed: s }),
      selectBeast: (id) => set({ selectedBeastId: id, selectedBedId: null }),
      selectBed: (id) => set({ selectedBedId: id, selectedBeastId: null }),

      addNotification: (type, message) => set(s => ({
        notifications: [{
          id: uid("notif"),
          type, message, timestamp: Date.now(),
        }, ...s.notifications].slice(0, 30),
      })),
      clearNotification: (id) => set(s => ({
        notifications: s.notifications.filter(n => n.id !== id),
      })),

      _addTransaction: (type, category, amount, description) => {
        const { currentDay, currentTime } = get();
        set(s => ({
          transactions: [...s.transactions, {
            id: uid("tx"),
            date: `第${currentDay}天 ${Math.floor(currentTime).toString().padStart(2, "0")}:${(Math.floor(currentTime % 1 * 60)).toString().padStart(2, "0")}`,
            day: currentDay,
            type, category, amount, description,
          }],
        }));
      },

      _spawnInitialBeasts: () => {
        const { currentDay, currentTime } = get();
        const initial: Beast[] = [];
        const count = randomInt(1, 2);
        for (let i = 0; i < count; i++) initial.push(generateRandomBeast(currentDay, currentTime));
        set({ waitingQueue: initial });
      },

      followUpQuestion: (beastId, statementId, questionIndex) => {
        const s = get();
        const beast = s.waitingQueue.find(b => b.id === beastId);
        if (!beast) return;

        const statement = beast.ownerStatement.statements.find(st => st.id === statementId);
        if (!statement) return;
        if (statement.revealedQuestions >= questionIndex + 1) return;
        if (beast.ownerStatement.followUpCount >= beast.ownerStatement.maxFollowUps) return;

        const satisfactionLoss = randomInt(3, 8);
        const newSatisfaction = Math.max(0, beast.satisfaction - satisfactionLoss);

        const credibilityBoost = randomInt(5, 12);
        const newCredibility = Math.min(100, beast.ownerStatement.credibility + credibilityBoost);

        const questionAsked = statement.followUpQuestions[questionIndex];
        const allQuestionsRevealed = questionIndex + 1 >= statement.followUpQuestions.length;
        const shouldRevealTruth = allQuestionsRevealed || Math.random() < 0.3 + (questionIndex * 0.2);

        let newSymptoms = [...beast.symptoms];
        let truthRevealed = statement.isTruthRevealed;

        if (shouldRevealTruth) {
          truthRevealed = true;
          const hiddenSymptoms = getHiddenSymptomsForTruth(statement.truth, beast.allSymptoms);
          for (const sym of hiddenSymptoms) {
            if (!newSymptoms.includes(sym) && newSymptoms.length < 5) {
              newSymptoms.push(sym);
            }
          }
        }

        const updatedStatements = beast.ownerStatement.statements.map(st => {
          if (st.id === statementId) {
            return {
              ...st,
              revealedQuestions: Math.max(st.revealedQuestions, questionIndex + 1),
              isTruthRevealed: truthRevealed,
            };
          }
          return st;
        });

        const updatedQueue = s.waitingQueue.map(b => {
          if (b.id === beastId) {
            return {
              ...b,
              satisfaction: newSatisfaction,
              symptoms: newSymptoms,
              ownerStatement: {
                ...b.ownerStatement,
                statements: updatedStatements,
                credibility: newCredibility,
                followUpCount: b.ownerStatement.followUpCount + 1,
              },
            };
          }
          return b;
        });

        set({ waitingQueue: updatedQueue });

        let message = `追问「${questionAsked}」 满意度-${satisfactionLoss}`;
        if (shouldRevealTruth) {
          message += ` 发现真相！可信度+${credibilityBoost}`;
        } else {
          message += ` 可信度+${credibilityBoost}`;
        }
        get().addNotification("info", message);
      },

      toggleAcceptStatement: (beastId, statementId, accept) => {
        const s = get();
        const beast = s.waitingQueue.find(b => b.id === beastId);
        if (!beast) return;

        const statement = beast.ownerStatement.statements.find(st => st.id === statementId);
        if (!statement) return;

        const content = statement.isTruthRevealed ? statement.truth : statement.initialStatement;
        const contentKey = `${statementId}-${statement.isTruthRevealed ? 'truth' : 'lie'}`;

        let newAccepted = [...beast.ownerStatement.acceptedContent];
        if (accept) {
          if (!newAccepted.includes(contentKey)) {
            newAccepted.push(contentKey);
          }
        } else {
          newAccepted = newAccepted.filter(k => k !== contentKey);
        }

        const updatedQueue = s.waitingQueue.map(b => {
          if (b.id === beastId) {
            return {
              ...b,
              ownerStatement: {
                ...b.ownerStatement,
                acceptedContent: newAccepted,
              },
            };
          }
          return b;
        });

        set({ waitingQueue: updatedQueue });
        get().addNotification("info", accept ? `已采信：${content.slice(0, 15)}...` : `已取消采信`);
      },

      dismissBeast: (id) => {
        const s = get();
        const beast = s.waitingQueue.find(b => b.id === id);
        if (!beast) return;
        const breed = BREEDS.find(b => b.id === beast.breedId);
        const loss = Math.min(s.reputation, 5 + Math.ceil(beast.satisfaction / 50));
        set(st => ({
          waitingQueue: st.waitingQueue.filter(b => b.id !== id),
          reputation: Math.max(0, st.reputation - loss),
          selectedBeastId: st.selectedBeastId === id ? null : st.selectedBeastId,
        }));
        get().addNotification("warning", `拒绝治疗${breed?.name || "灵兽"}(名：${beast.name})，声望-${loss}`);
      },

      purchaseHerb: (herbId, qty) => {
        const herb = HERBS.find(h => h.id === herbId);
        if (!herb) return;
        const totalCost = herb.price * qty;
        const s = get();
        if (s.money < totalCost) {
          s.addNotification("error", "金钱不足，无法采购药材");
          return;
        }
        set(st => ({
          money: st.money - totalCost,
          inventory: { ...st.inventory, [herbId]: (st.inventory[herbId] ?? 0) + qty },
        }));
        get()._addTransaction("expense", "药材采购", totalCost, `采购 ${herb.name} x${qty}`);
        get().addNotification("success", `采购 ${herb.name} x${qty}，花费${totalCost}金`);
      },

      assignBedAndTreat: (beastId, bedId, staffId, herbIds, playerDiagnosis) => {
        const s = get();
        const beast = s.waitingQueue.find(b => b.id === beastId);
        const bed = s.beds.find(b => b.id === bedId);
        if (!beast || !bed || bed.status !== "empty") {
          s.addNotification("error", "分配失败：灵兽或床位不可用");
          return;
        }
        for (const hid of herbIds) {
          if ((s.inventory[hid] ?? 0) < 1) {
            s.addNotification("error", `药材不足`);
            return;
          }
        }
        if (staffId) {
          const st = s.staff.find(x => x.id === staffId);
          if (!st || st.status !== "idle") {
            s.addNotification("error", "该护理员当前不可用");
            return;
          }
        }

        const newInventory = { ...s.inventory };
        herbIds.forEach(hid => { newInventory[hid] = (newInventory[hid] ?? 0) - 1; });
        const herbsCost = herbIds.reduce((sum, hid) => {
          const h = HERBS.find(x => x.id === hid);
          return sum + (h?.price ?? 0);
        }, 0);

        const hasStaff = !!staffId;
        const staffSkillBonus = staffId ? (s.staff.find(x => x.id === staffId)?.skillLevel ?? 1) * 5 : 0;
        void staffSkillBonus;

        const totalHours = calcTreatmentHours(beast.severity, hasStaff);

        const newBeds = s.beds.map(b => b.id === bedId ? {
          ...b,
          status: "occupied" as const,
          assignedBeastId: beastId,
          assignedStaffId: staffId,
          treatmentProgress: 0,
          treatmentTotal: totalHours,
          result: "pending" as const,
          currentPrescriptionHerbs: [...herbIds],
          playerDiagnosis,
          startedAt: s.currentTime,
          beastSnapshot: {
            id: beast.id,
            breedId: beast.breedId,
            name: beast.name,
            disease: beast.disease,
            severity: beast.severity,
            satisfaction: beast.satisfaction,
            symptoms: beast.symptoms,
            allSymptoms: beast.allSymptoms,
            ownerStatement: JSON.parse(JSON.stringify(beast.ownerStatement)),
          },
        } : b);

        const newStaff = s.staff.map(st => st.id === staffId ? { ...st, status: "working" as const, assignedBedId: bedId } : st);

        const newDiscovered = s.discoveredBreeds.includes(beast.breedId)
          ? s.discoveredBreeds : [...s.discoveredBreeds, beast.breedId];

        set(st => ({
          waitingQueue: st.waitingQueue.filter(b => b.id !== beastId),
          beds: newBeds,
          staff: newStaff,
          inventory: newInventory,
          money: st.money - herbsCost,
          discoveredBreeds: newDiscovered,
          selectedBeastId: null,
        }));
        get()._addTransaction("expense", "药材消耗", herbsCost, `${beast.name} 治疗消耗药材`);
        get().addNotification("info", `${beast.name} 已入住 ${bed.name}，预计${totalHours}小时治疗`);
      },

      collectFromBed: (bedId) => {
        const s = get();
        const bed = s.beds.find(b => b.id === bedId);
        if (!bed || bed.result === "pending" || !bed.beastSnapshot) return;
        const beast = bed.beastSnapshot;

        const bedBeastId = bed.assignedBeastId;
        const treatmentHerbs = bed.currentPrescriptionHerbs;
        const matchedPresc = PRESCRIPTIONS.find(p =>
          JSON.stringify([...p.herbIds].sort()) === JSON.stringify([...treatmentHerbs].sort())
        );
        const usedPrescNames = matchedPresc ? matchedPresc.name : "自拟方";
        void usedPrescNames;

        const breed = BREEDS.find(b => b.id === (beast?.breedId || ""));
        const ownerStmt = beast?.ownerStatement;

        const acceptedContent = ownerStmt ? ownerStmt.statements
          .filter(st => {
            const keyTruth = `${st.id}-truth`;
            const keyLie = `${st.id}-lie`;
            return ownerStmt.acceptedContent.includes(keyTruth) || ownerStmt.acceptedContent.includes(keyLie);
          })
          .map(st => {
            const keyTruth = `${st.id}-truth`;
            if (ownerStmt.acceptedContent.includes(keyTruth)) {
              return `✓ ${CATEGORY_LABELS[st.category]}：${st.truth}`;
            }
            return `✗ ${CATEGORY_LABELS[st.category]}：${st.initialStatement}`;
          }) : [];

        let consequence: FollowUpConsequence | null = null;
        if (ownerStmt) {
          const acceptedTruths = ownerStmt.statements.filter(st => 
            ownerStmt.acceptedContent.includes(`${st.id}-truth`)
          );
          const acceptedLies = ownerStmt.statements.filter(st => 
            ownerStmt.acceptedContent.includes(`${st.id}-lie`)
          );
          
          if (bed.result === "success") {
            let description = "治疗成功";
            if (acceptedTruths.length > 0) {
              description = `采信了 ${acceptedTruths.length} 条真相，诊断准确，治疗成功`;
            } else if (ownerStmt.statements.length > 0 && acceptedLies.length === 0) {
              description = "未采信主人陈述，凭借经验诊断成功";
            }
            consequence = {
              type: "success",
              description,
            };
          } else {
            let description = "治疗失败";
            let missedSymptom: string | undefined;
            let misdiagnosedDisease: DiseaseType | undefined;
            
            if (acceptedLies.length > 0) {
              const lieStmt = acceptedLies[0];
              description = `采信了谎言「${lieStmt.initialStatement.slice(0, 15)}...」，导致误诊`;
              const hiddenSymptoms = getHiddenSymptomsForTruth(lieStmt.truth, beast?.allSymptoms || []);
              if (hiddenSymptoms.length > 0 && beast) {
                missedSymptom = hiddenSymptoms.find(s => !beast.symptoms.includes(s)) || hiddenSymptoms[0];
              }
              misdiagnosedDisease = bed.playerDiagnosis || undefined;
            } else if (ownerStmt.statements.length > 0 && acceptedTruths.length === 0) {
              description = "未追问也未采信主人陈述，遗漏关键信息";
              const unrevealedStmt = ownerStmt.statements.find(st => !st.isTruthRevealed);
              if (unrevealedStmt && beast) {
                const hiddenSymptoms = getHiddenSymptomsForTruth(unrevealedStmt.truth, beast.allSymptoms);
                if (hiddenSymptoms.length > 0) {
                  missedSymptom = hiddenSymptoms[0];
                }
              }
            } else {
              description = "治疗方案有误，未能治愈";
            }
            
            consequence = {
              type: "fail",
              description,
              missedSymptom,
              misdiagnosedDisease,
            };
          }
        }

        if (bed.result === "success" && beast && breed) {
          const severityMult = { mild: 1, moderate: 1.4, severe: 1.8, critical: 2.3 }[beast.severity] || 1;
          const satMult = beast.satisfaction / 100;
          const reputationBonus = s.reputation / 100;
          const revenue = Math.floor(breed.baseFees * severityMult * (0.8 + 0.4 * satMult) * (1 + reputationBonus * 0.3));
          let repGain = Math.ceil(3 * severityMult * satMult);
          const trustGain = Math.ceil(10 * severityMult * satMult);

          const diagnosisCorrect = bed.playerDiagnosis === beast.disease;
          if (diagnosisCorrect) {
            repGain += 2;
          }

          let evolved = false;
          let newStage = 0;
          const prevRel = s.beastRelationships[breed.id];
          const prevVisits = prevRel?.visits ?? 0;
          const prevTrust = prevRel?.trust ?? 0;
          const newVisits = prevVisits + 1;
          const newTrust = prevTrust + trustGain;
          const nextStage = Math.floor(newTrust / 25);
          if (nextStage > (prevRel?.highestStage ?? 0) && breed.evolutionEmojis[nextStage]) {
            evolved = true;
            newStage = nextStage;
          }
          void newStage;

          const notes = rand(NOTES_SUCCESS);
          const days = 1;
          const daysToHeal = days;

          const record: MedicalRecord = {
            id: uid("rec"),
            beastId: bedBeastId!,
            breedId: breed.id,
            beastName: beast.name,
            date: `第${s.currentDay}天`,
            disease: beast.disease,
            severity: beast.severity,
            prescriptions: treatmentHerbs,
            success: true,
            revenue,
            daysToHeal,
            evolved,
            notes: evolved ? `${notes} 灵兽发生了进化！` : notes,
            ownerAcceptedContent: acceptedContent,
            ownerStatements: ownerStmt?.statements || [],
            followUpCount: ownerStmt?.followUpCount || 0,
            finalCredibility: ownerStmt?.credibility || 0,
            consequence,
          };

          const newRel: BeastRelationship = {
            breedId: breed.id,
            trust: newTrust,
            visits: newVisits,
            evolved: evolved || prevRel?.evolved || false,
            highestStage: Math.max(nextStage, prevRel?.highestStage ?? 0),
          };

          set(st => ({
            money: st.money + revenue,
            reputation: Math.min(100, st.reputation + repGain),
            beastRelationships: { ...st.beastRelationships, [breed.id]: newRel },
            medicalRecords: [record, ...st.medicalRecords],
          }));
          get()._addTransaction("income", "诊金收入", revenue, `治愈 ${breed.name}·${beast.name}${evolved ? "(进化加成)" : ""}`);
          const evolveMsg = evolved ? " 🎉灵兽发生进化！额外获得加成！" : "";
          const diagMsg = diagnosisCorrect ? " 🔍诊断正确！" : "";
          get().addNotification("success", `治愈成功！获得 ${revenue} 金，声望+${repGain}，亲密度+${trustGain}${diagMsg}${evolveMsg}`);
        } else if (bed.result === "fail" && beast) {
          const penaltyMoney = Math.floor(s.money * 0.05) + 20;
          const penaltyRep = 5;
          const breedName = breed?.name || "灵兽";

          const notes = rand(NOTES_FAIL);
          const record: MedicalRecord = {
            id: uid("rec"),
            beastId: bedBeastId!,
            breedId: beast.breedId,
            beastName: beast.name,
            date: `第${s.currentDay}天`,
            disease: beast.disease,
            severity: beast.severity,
            prescriptions: treatmentHerbs,
            success: false,
            revenue: -penaltyMoney,
            daysToHeal: Math.max(1, Math.ceil((s.currentTime - (bed.startedAt ?? s.currentTime)) / 24) || 1),
            evolved: false,
            notes,
            ownerAcceptedContent: acceptedContent,
            ownerStatements: ownerStmt?.statements || [],
            followUpCount: ownerStmt?.followUpCount || 0,
            finalCredibility: ownerStmt?.credibility || 0,
            consequence,
          };

          set(st => ({
            money: Math.max(0, st.money - penaltyMoney),
            reputation: Math.max(0, st.reputation - penaltyRep),
            medicalRecords: [record, ...st.medicalRecords],
          }));
          get()._addTransaction("expense", "误诊赔偿", penaltyMoney, `${breedName}·${beast.name} 治疗失败赔偿`);
          const realDiseaseName = DISEASE_NAMES[beast.disease];
          get().addNotification("error", `治疗失败！确诊为「${realDiseaseName}」。赔偿 ${penaltyMoney} 金，声望-${penaltyRep}`);
        }

        // Release staff & bed
        const newBeds = s.beds.map(b => b.id === bedId ? {
          ...b,
          status: "empty" as const,
          assignedBeastId: null,
          assignedStaffId: null,
          treatmentProgress: 0,
          treatmentTotal: 0,
          result: "pending" as const,
          currentPrescriptionHerbs: [],
          playerDiagnosis: null,
          startedAt: null,
          beastSnapshot: null,
        } : b);
        const staffToRelease = bed.assignedStaffId;
        const newStaff = s.staff.map(st => st.id === staffToRelease ? {
          ...st, status: "idle" as const, assignedBedId: null,
        } : st);

        set({ beds: newBeds, staff: newStaff, selectedBedId: null });
      },

      _dailySettlement: () => {
        const s = get();
        const totalWage = s.staff.reduce((sum, st) => sum + st.dailyWage, 0);
        const day = s.currentDay;
        const newWeather = rand(WEATHERS);

        // 天气事件
        let eventMsg = "";
        let bonusMoney = 0;
        if (newWeather === "misty") { bonusMoney = -20; eventMsg = "大雾天气，客人稀少。"; }
        else if (newWeather === "stormy") { bonusMoney = -30; eventMsg = "雷暴天气，采购运输受阻。"; }
        else if (newWeather === "sunny") { bonusMoney = 10; eventMsg = "晴朗天气，心情舒畅。"; }

        const newRelStaff = s.staff.map(st => {
          const isAssignedToActiveBed = s.beds.some(b =>
            b.status === "occupied" && b.result === "pending" && b.assignedStaffId === st.id
          );
          if (isAssignedToActiveBed) return st;
          return { ...st, status: "idle" as const, assignedBedId: null };
        });

        set(st => ({
          currentDay: day + 1,
          currentTime: 8,
          weather: newWeather,
          staff: newRelStaff,
          money: Math.max(0, st.money - totalWage + bonusMoney),
          lastBeastSpawn: 8,
        }));
        get()._addTransaction("expense", "员工工资", totalWage, `第${day}天员工薪资`);
        if (bonusMoney !== 0) {
          get()._addTransaction(
            bonusMoney >= 0 ? "income" : "expense",
            "天气事件",
            Math.abs(bonusMoney),
            `第${day}天结算：${eventMsg} (${bonusMoney >= 0 ? "+" : ""}${bonusMoney}金)`
          );
        }
        get().addNotification("info", `=== 第${day}天结算 === 支付薪资${totalWage}金。${eventMsg} 新的一天开始啦！`);
      },

      resetGame: () => {
        set(buildInitialState());
        setTimeout(() => get()._spawnInitialBeasts(), 100);
      },

      tickGame: (steps = 1) => {
        for (let i = 0; i < steps; i++) {
          const s = get();
          if (s.isPaused) return;

          let newTime = s.currentTime + 1;
          let dayPassed = false;
          if (newTime >= 24) { dayPassed = true; }

          let state = { ...s };

          // 1. 队列恶化
          const newQueue: Beast[] = state.waitingQueue.map(b => {
            const waited = b.waitHours + 1;
            let sev = b.severity;
            let sat = Math.max(0, b.satisfaction - randomInt(2, 5));
            if (waited > 4 && sev === "mild") sev = "moderate";
            else if (waited > 7 && sev === "moderate") sev = "severe";
            else if (waited > 10 && sev === "severe") sev = "critical";
            return { ...b, waitHours: waited, severity: sev, satisfaction: sat };
          });
          const stillWaiting: Beast[] = [];
          let repLossQueue = 0;
          for (const b of newQueue) {
            if (b.waitHours > 14) {
              repLossQueue += 8;
              const breedName = BREEDS.find(x => x.id === b.breedId)?.name || "灵兽";
              get().addNotification("warning", `${breedName}·${b.name} 等待太久，失望离去。声望-8`);
            } else stillWaiting.push(b);
          }
          state.waitingQueue = stillWaiting;
          state.reputation = Math.max(0, state.reputation - repLossQueue);

          // 2. 治疗进度
          const newBeds = state.beds.map(b => {
            if (b.status !== "occupied" || b.result !== "pending") return b;
            const staffBonus = b.assignedStaffId ? 1.3 : 1;
            const newProgress = b.treatmentProgress + staffBonus;
            let result: TreatmentResult = b.result;
            if (newProgress >= b.treatmentTotal) {
              // 判定
              const herbs = b.currentPrescriptionHerbs;
              const matchedPresc = PRESCRIPTIONS.find(p =>
                JSON.stringify([...p.herbIds].sort()) === JSON.stringify([...herbs].sort())
              );
              let finalRate = matchedPresc ? matchedPresc.successRate : 30;
              // 员工加成
              if (b.assignedStaffId) {
                const stf = state.staff.find(x => x.id === b.assignedStaffId);
                finalRate += (stf?.skillLevel ?? 1) * 5;
              }
              // 疾病严重度减成
              const sev = b.beastSnapshot?.severity ?? "mild";
              const sevDebuff = { mild: 0, moderate: -5, severe: -10, critical: -15 }[sev] || 0;
              finalRate = Math.max(5, Math.min(98, finalRate + sevDebuff));
              result = Math.random() * 100 <= finalRate ? "success" : "fail";
            }
            return { ...b, treatmentProgress: Math.min(newProgress, b.treatmentTotal), result };
          });
          state.beds = newBeds;

          // 3. 新灵兽生成
          if (!dayPassed && newTime >= 8 && newTime < 21) {
            const chance = 0.25 + Math.min(0.3, state.currentDay * 0.015);
            if (newTime - state.lastBeastSpawn >= randomInt(1, 2) && Math.random() <= chance && state.waitingQueue.length < 6) {
              const nb = generateRandomBeast(state.currentDay, newTime);
              state.waitingQueue = [...state.waitingQueue, nb];
              state.lastBeastSpawn = newTime;
              const breed = BREEDS.find(b => b.id === nb.breedId);
              get().addNotification("info", `新客人：${breed?.name || "灵兽"}·${nb.name} 前来就诊`);
            }
          }

          state.currentTime = dayPassed ? 8 : newTime;

          set(state);
          if (dayPassed) get()._dailySettlement();
        }
      },
    }),
    {
      name: "beast-clinic-save",
      version: 1,
      merge: (persisted, current) => ({ ...current, ...(persisted as object) }),
      onRehydrateStorage: () => (state) => {
        if (state && state.waitingQueue.length === 0 && state.medicalRecords.length === 0) {
          // 全新存档
          setTimeout(() => state._spawnInitialBeasts(), 100);
        }
      },
    }
  )
);
