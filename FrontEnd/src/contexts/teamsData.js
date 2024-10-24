import KIA_Logo from "../assets/images/KIA_Logo.png";
import KIA_EM from "../assets/images/KIA_EM.png";
import Samsung_Logo from "../assets/images/Samsung_Logo.png";
import Samsung_EM from "../assets/images/Samsung_EM.png";
import LG_Logo from "../assets/images/LG_Logo.png";
import LG_EM from "../assets/images/LG_EM.png";
import Doosan_Logo from "../assets/images/Doosan_Logo.png";
import Doosan_EM from "../assets/images/Doosan_EM.png";
import KT_Logo from "../assets/images/KT_Logo.png";
import KT_EM from "../assets/images/KT_EM.png";
import Kiwoom_Logo from "../assets/images/Kiwoom_Logo.png";
import Kiwoom_EM from "../assets/images/Kiwoom_EM.png";
import Hanwha_Logo from "../assets/images/Hanwha_Logo.png";
import Hanwha_EM from "../assets/images/Hanwha_EM.png";
import SSG_Logo from "../assets/images/SSG_Logo.png";
import SSG_EM from "../assets/images/SSG_EM.png";
import NC_Logo from "../assets/images/NC_Logo.png";
import NC_EM from "../assets/images/NC_EM.png";
import Lotte_Logo from "../assets/images/Lotte_Logo.png";
import Lotte_EM from "../assets/images/Lotte_EM.png";

// 기존 팀 데이터에 id 필드 추가
export const teams = [
  { id: 0, value: "%25", label: "통합" },
  { id: 1, value: "KIA", label: "KIA", logo: KIA_Logo, emblem: KIA_EM },
  {
    id: 2,
    value: "삼성",
    label: "삼성",
    logo: Samsung_Logo,
    emblem: Samsung_EM,
  },
  { id: 3, value: "LG", label: "LG", logo: LG_Logo, emblem: LG_EM },
  { id: 4, value: "두산", label: "두산", logo: Doosan_Logo, emblem: Doosan_EM },
  { id: 5, value: "KT", label: "KT", logo: KT_Logo, emblem: KT_EM },
  { id: 6, value: "한화", label: "한화", logo: Hanwha_Logo, emblem: Hanwha_EM },
  { id: 7, value: "롯데", label: "롯데", logo: Lotte_Logo, emblem: Lotte_EM },
  { id: 8, value: "SSG", label: "SSG", logo: SSG_Logo, emblem: SSG_EM },
  { id: 9, value: "NC", label: "NC", logo: NC_Logo, emblem: NC_EM },
  {
    id: 10,
    value: "키움",
    label: "키움",
    logo: Kiwoom_Logo,
    emblem: Kiwoom_EM,
  },
];

// 팀 id로 팀 이름을 가져오는 함수
export const getTeamNameById = (id) => {
  if (id === 0) {
    return "통합"; // 0일 경우 "통합" 반환
  }
  // 기존 로직
  const team = teams.find((team) => team.id === id);
  return team ? team.label : "알 수 없음";
};

// 팀 이름으로 엠블럼 찾는 함수
export const getTeamEmblem = (teamName) => {
  const team = teams.find((team) => team.value === teamName);
  return team ? team.emblem : null;
};
