import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { API_ENDPOINTS } from "../config/api";

const AdminContainer = styled.div`
  min-height: 100vh;
  background: #f8f9fa;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
`;

const AdminHeader = styled.div`
  background: #417690;
  color: white;
  padding: 1rem 2rem;
  border-bottom: 1px solid #205067;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const AdminTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 400;
  color: white;
  margin: 0 0 0.25rem 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
`;

const AdminSubtitle = styled.p`
  color: #e8f4f8;
  font-size: 0.875rem;
  margin: 0;
  font-weight: 300;
`;

const TabContainer = styled.div`
  background: white;
  margin: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #ddd;
`;

const TabList = styled.div`
  display: flex;
  border-bottom: 1px solid #ddd;
  background: #f8f9fa;
`;

const Tab = styled.button`
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: none;
  background: ${(props) => (props.$active ? "white" : "transparent")};
  color: ${(props) => (props.$active ? "#333" : "#666")};
  font-weight: 400;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: ${(props) =>
    props.$active ? "3px solid #417690" : "3px solid transparent"};
  font-size: 0.875rem;

  &:hover {
    background: ${(props) => (props.$active ? "white" : "#e9ecef")};
  }
`;

const TabContent = styled.div`
  padding: 1.5rem 2rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 1.5rem 2rem;
`;

const StatCard = styled.div`
  background: white;
  border: 1px solid #ddd;
  padding: 1rem;
  text-align: left;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #417690;
`;

const StatNumber = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  color: #666;
  font-size: 0.875rem;
  font-weight: 400;
`;

const RequestCard = styled.div`
  background: white;
  border: 1px solid #ddd;
  padding: 1rem;
  margin-bottom: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-left: 4px solid
    ${(props) =>
      props.status === "pending"
        ? "#ffc107"
        : props.status === "matched"
        ? "#417690"
        : "#dc3545"};
`;

const RequestHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
`;

const UserInfo = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 3px;
  background: #417690;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 500;
  font-size: 1rem;
`;

const UserDetails = styled.div`
  flex: 1;
`;

const UserName = styled.h3`
  margin: 0 0 0.125rem 0;
  color: #333;
  font-size: 1rem;
  font-weight: 500;
`;

const UserMeta = styled.p`
  margin: 0;
  color: #666;
  font-size: 0.875rem;
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 3px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${(props) =>
    props.status === "pending"
      ? "#fff3cd"
      : props.status === "matched"
      ? "#d4edda"
      : "#f8d7da"};
  color: ${(props) =>
    props.status === "pending"
      ? "#856404"
      : props.status === "matched"
      ? "#155724"
      : "#721c24"};
  border: 1px solid
    ${(props) =>
      props.status === "pending"
        ? "#ffeaa7"
        : props.status === "matched"
        ? "#a8e6cf"
        : "#fab1a0"};
`;

const RequestDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.75rem;
  margin-bottom: 0.75rem;
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
`;

const DetailLabel = styled.span`
  font-size: 0.75rem;
  color: #666;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DetailValue = styled.span`
  font-size: 0.875rem;
  color: #333;
  font-weight: 400;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #eee;
`;

const ActionBtn = styled.button`
  padding: 0.375rem 0.75rem;
  border: 1px solid;
  border-radius: 3px;
  font-size: 0.75rem;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;

  ${(props) =>
    props.variant === "primary" &&
    `
    background: #417690;
    color: white;
    border-color: #417690;
    &:hover {
      background: #205067;
      border-color: #205067;
    }
  `}

  ${(props) =>
    props.variant === "success" &&
    `
    background: #28a745;
    color: white;
    border-color: #28a745;
    &:hover {
      background: #218838;
      border-color: #218838;
    }
  `}

  ${(props) =>
    props.variant === "danger" &&
    `
    background: #dc3545;
    color: white;
    border-color: #dc3545;
    &:hover {
      background: #c82333;
      border-color: #c82333;
    }
  `}

  ${(props) =>
    props.variant === "secondary" &&
    `
    background: #6c757d;
    color: white;
    border-color: #6c757d;
    &:hover {
      background: #5a6268;
      border-color: #5a6268;
    }
  `}
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  font-size: 1.1rem;
  color: #666;
`;

// 매칭된 쌍 표시용 스타일
const MatchedPairSection = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-left: 4px solid #417690;
`;

const MatchedPairTitle = styled.h4`
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #ddd;
  padding-bottom: 0.5rem;
`;

const MatchedTime = styled.span`
  font-size: 0.75rem;
  font-weight: 400;
  color: #666;
  background: #e9ecef;
  padding: 0.25rem 0.5rem;
  border-radius: 3px;
  border: 1px solid #ddd;
`;

const MatchedPairContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: stretch;
  gap: 1.5rem;
  width: 100%;
  min-height: 200px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    min-height: auto;
  }
`;

const MatchedPersonCard = styled.div`
  background: white;
  border: 1px solid #ddd;
  border-radius: 3px;
  padding: 1rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  }
`;

const MatchedPersonHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 0.75rem;
`;

const MatchedPersonAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 3px;
  background: #417690;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 500;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;

  &:hover {
    background: #205067;
  }
`;

const MatchedPersonName = styled.h5`
  margin: 0;
  color: #2c3e50;
  font-size: 1.1rem;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const PersonLabel = styled.span`
  background: #417690;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 3px;
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 0.3rem;
`;

const MatchedPersonInfo = styled.div`
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #6c757d;
  font-weight: 500;

  div {
    margin-bottom: 0.3rem;
    padding: 0.2rem 0;
    border-bottom: 1px solid rgba(108, 117, 125, 0.1);

    &:last-child {
      border-bottom: none;
    }
  }
`;

const MatchedPersonLanguages = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: auto;
`;

const LanguageTag = styled.span`
  background: #417690;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 3px;
  font-size: 0.75rem;
  font-weight: 400;
  display: inline-block;
  margin: 0.1rem;
  transition: all 0.2s ease;

  &:hover {
    background: #205067;
  }
`;

const MatchedArrow = styled.div`
  font-size: 1.5rem;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 60px;
  background: #f8f9fa;
  border-radius: 3px;
  width: 60px;
  height: 60px;
  border: 1px solid #ddd;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    transform: rotate(90deg);
    margin: 0.5rem 0;
    width: 50px;
    height: 50px;
    min-width: 50px;
  }
`;

// 모달 스타일
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  padding: 2rem;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
  text-align: center;
`;

const PartnerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1rem 0;
`;

const PartnerCard = styled.div`
  border: 1px solid ${(props) => (props.selected ? "#007bff" : "#e9ecef")};
  border-radius: 6px;
  padding: 1rem;
  cursor: pointer;
  background: ${(props) => (props.selected ? "#f8f9fa" : "white")};
  transition: all 0.3s ease;

  &:hover {
    border-color: #007bff;
    background: #f8f9fa;
  }
`;

const PartnerName = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 0.5rem 0;
`;

const PartnerInfo = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
`;

const LanguageTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
`;

const AdminMatching = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("pending");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pending: 0,
    matched: 0,
    rejected: 0,
    total: 0,
  });
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [availablePartners, setAvailablePartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);

  useEffect(() => {
    loadRequests();
  }, [activeTab]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.MATCHING_REQUESTS, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const allRequests = data.requests || [];

        // 시리얼라이저에서 이미 매칭된 파트너 정보를 제공하므로 별도 API 호출 불필요
        const requestsWithPartners = allRequests;

        // 탭별로 필터링
        let filteredRequests = [];
        switch (activeTab) {
          case "pending":
            filteredRequests = requestsWithPartners.filter(
              (req) => req.status === "pending"
            );
            break;
          case "matched":
            filteredRequests = requestsWithPartners.filter(
              (req) => req.status === "matched"
            );
            // 매칭 완료된 요청은 매칭 시간순으로 정렬
            filteredRequests.sort((a, b) => {
              const dateA = new Date(a.matched_at || a.updated_at);
              const dateB = new Date(b.matched_at || b.updated_at);
              return dateB - dateA;
            });
            break;
          case "rejected":
            filteredRequests = requestsWithPartners.filter(
              (req) => req.status === "rejected"
            );
            break;
          default:
            filteredRequests = requestsWithPartners;
        }

        // 최신순 정렬 (매칭 완료가 아닌 경우)
        if (activeTab !== "matched") {
          filteredRequests.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );
        }
        setRequests(filteredRequests);

        // 통계 계산
        const pending = requestsWithPartners.filter(
          (req) => req.status === "pending"
        ).length;
        const matched = requestsWithPartners.filter(
          (req) => req.status === "matched"
        ).length;
        const rejected = requestsWithPartners.filter(
          (req) => req.status === "rejected"
        ).length;

        setStats({
          pending,
          matched,
          rejected,
          total: requestsWithPartners.length,
        });
      }
    } catch (error) {
      console.error("요청 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    const request = requests.find((req) => req.id === requestId);
    if (request) {
      setSelectedRequest(request);
      await loadAvailablePartners(request);
      setShowPartnerModal(true);
    }
  };

  const loadAvailablePartners = async (request) => {
    try {
      const response = await fetch(
        `${API_ENDPOINTS.AVAILABLE_PARTNERS}/?request_id=${request.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAvailablePartners(data.partners || []);
      }
    } catch (error) {
      console.error("파트너 로드 실패:", error);
    }
  };

  const handlePartnerSelect = (partner) => {
    setSelectedPartner(partner);
  };

  const handleConfirmMatch = async () => {
    if (!selectedRequest || !selectedPartner) return;

    try {
      const response = await fetch(
        API_ENDPOINTS.APPROVE_REQUEST(selectedRequest.id),
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            partner_id: selectedPartner.id,
          }),
        }
      );

      if (response.ok) {
        alert(`${selectedPartner.nickname}님과의 매칭이 완료되었습니다!`);
        setShowPartnerModal(false);
        setSelectedRequest(null);
        setSelectedPartner(null);
        await loadRequests();
      }
    } catch (error) {
      console.error("매칭 승인 실패:", error);
    }
  };

  const handleReject = async (requestId) => {
    if (window.confirm("이 요청을 거부하시겠습니까?")) {
      try {
        const response = await fetch(API_ENDPOINTS.REJECT_REQUEST(requestId), {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          await loadRequests();
        }
      } catch (error) {
        console.error("매칭 거부 실패:", error);
      }
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "승인 대기";
      case "matched":
        return "매칭 완료";
      case "rejected":
        return "거부됨";
      default:
        return "알 수 없음";
    }
  };

  const renderRequests = () => {
    if (loading) {
      return <LoadingSpinner>로딩 중...</LoadingSpinner>;
    }

    if (requests.length === 0) {
      return (
        <EmptyState>
          <h3>
            {activeTab === "pending"
              ? "승인 대기 중인 요청이 없습니다"
              : activeTab === "matched"
              ? "매칭 완료된 요청이 없습니다"
              : "거부된 요청이 없습니다"}
          </h3>
          <p>
            {activeTab === "pending"
              ? "새로운 매칭 요청이 들어오면 여기에 표시됩니다."
              : activeTab === "matched"
              ? "완료된 매칭이 없습니다."
              : "거부된 요청이 없습니다."}
          </p>
        </EmptyState>
      );
    }

    return requests.map((request) => (
      <RequestCard key={request.id} status={request.status}>
        <RequestHeader>
          <UserInfo>
            <UserAvatar>{request.user?.nickname?.charAt(0)}</UserAvatar>
            <UserDetails>
              <UserName>{request.user?.nickname || "알 수 없음"}</UserName>
              <UserMeta>
                {request.user?.school || "학교 미설정"} •{" "}
                {request.user?.gender || "성별 미설정"}
              </UserMeta>
            </UserDetails>
          </UserInfo>
          <StatusBadge status={request.status}>
            {getStatusText(request.status)}
          </StatusBadge>
        </RequestHeader>

        <RequestDetails>
          <DetailItem>
            <DetailLabel>배우고 싶은 언어</DetailLabel>
            <DetailValue>
              {request.learning_languages?.join(", ") || "미설정"}
            </DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>가르칠 수 있는 언어</DetailLabel>
            <DetailValue>
              {request.teaching_languages?.join(", ") || "미설정"}
            </DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>성별 선호도</DetailLabel>
            <DetailValue>{request.gender_preference || "무관"}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>대학교 선호도</DetailLabel>
            <DetailValue>{request.university_preference || "무관"}</DetailValue>
          </DetailItem>
        </RequestDetails>

        {/* 매칭 완료된 경우 매칭된 쌍 정보 표시 */}
        {request.status === "matched" && (
          <MatchedPairSection>
            <MatchedPairTitle>
              매칭된 쌍: {request.user?.nickname || "사용자"} ↔{" "}
              {request.matched_partner?.nickname || "파트너"}
              <MatchedTime>
                {request.matched_at
                  ? new Date(request.matched_at).toLocaleString("ko-KR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : new Date(request.updated_at).toLocaleString("ko-KR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
              </MatchedTime>
            </MatchedPairTitle>
            <MatchedPairContainer>
              {/* 요청자 */}
              <MatchedPersonCard>
                <MatchedPersonHeader>
                  <MatchedPersonAvatar>
                    {request.user?.nickname?.charAt(0) || "U"}
                  </MatchedPersonAvatar>
                  <MatchedPersonName>
                    {request.user?.nickname || "알 수 없음"}
                  </MatchedPersonName>
                  <PersonLabel>요청자</PersonLabel>
                </MatchedPersonHeader>
                <MatchedPersonInfo>
                  <div>{request.user?.gender || "성별 미설정"}</div>
                  <div>{request.user?.school || "학교 미설정"}</div>
                </MatchedPersonInfo>
                <MatchedPersonLanguages>
                  <LanguageTag>
                    가르칠 수 있는 언어:{" "}
                    {request.teaching_languages?.join(", ") || "미설정"}
                  </LanguageTag>
                  <LanguageTag>
                    배우고 싶은 언어:{" "}
                    {request.learning_languages?.join(", ") || "미설정"}
                  </LanguageTag>
                </MatchedPersonLanguages>
              </MatchedPersonCard>

              {/* 매칭 화살표 */}
              <MatchedArrow>↔</MatchedArrow>

              {/* 매칭된 파트너 */}
              <MatchedPersonCard>
                {request.matched_partner ? (
                  <>
                    <MatchedPersonHeader>
                      <MatchedPersonAvatar>
                        {request.matched_partner.nickname?.charAt(0) || "P"}
                      </MatchedPersonAvatar>
                      <MatchedPersonName>
                        {request.matched_partner.nickname || "알 수 없음"}
                      </MatchedPersonName>
                      <PersonLabel>파트너</PersonLabel>
                    </MatchedPersonHeader>
                    <MatchedPersonInfo>
                      <div>
                        {request.matched_partner.gender || "성별 미설정"}
                      </div>
                      <div>
                        {request.matched_partner.university ||
                          request.matched_partner.school ||
                          "학교 미설정"}
                      </div>
                    </MatchedPersonInfo>
                    <MatchedPersonLanguages>
                      <LanguageTag>
                        가르칠 수 있는 언어:{" "}
                        {request.matched_partner.teaching_languages?.join(
                          ", "
                        ) || "미설정"}
                      </LanguageTag>
                      <LanguageTag>
                        배우고 싶은 언어:{" "}
                        {request.matched_partner.learning_languages?.join(
                          ", "
                        ) || "미설정"}
                      </LanguageTag>
                    </MatchedPersonLanguages>
                  </>
                ) : (
                  <>
                    <MatchedPersonHeader>
                      <MatchedPersonAvatar>?</MatchedPersonAvatar>
                      <MatchedPersonName>매칭된 파트너</MatchedPersonName>
                    </MatchedPersonHeader>
                    <MatchedPersonInfo>
                      <div>정보 없음</div>
                      <div>매칭 정보를 불러올 수 없습니다</div>
                    </MatchedPersonInfo>
                    <MatchedPersonLanguages>
                      <LanguageTag>상세 정보 없음</LanguageTag>
                    </MatchedPersonLanguages>
                  </>
                )}
              </MatchedPersonCard>
            </MatchedPairContainer>
          </MatchedPairSection>
        )}

        <ActionButtons>
          <ActionBtn
            variant="secondary"
            onClick={() => navigate(`/profile/${request.user?.id}`)}
          >
            요청자 프로필
          </ActionBtn>

          {request.status === "matched" && request.matched_partner && (
            <ActionBtn
              variant="primary"
              onClick={() => navigate(`/profile/${request.matched_partner.id}`)}
            >
              매칭된 파트너 프로필
            </ActionBtn>
          )}

          {request.status === "pending" && (
            <>
              <ActionBtn
                variant="danger"
                onClick={() => handleReject(request.id)}
              >
                거부
              </ActionBtn>
              <ActionBtn
                variant="success"
                onClick={() => handleApprove(request.id)}
              >
                승인
              </ActionBtn>
            </>
          )}

          {request.status === "rejected" && (
            <ActionBtn
              variant="success"
              onClick={() => handleApprove(request.id)}
            >
              재승인
            </ActionBtn>
          )}
        </ActionButtons>
      </RequestCard>
    ));
  };

  return (
    <AdminContainer>
      <AdminHeader>
        <AdminTitle>매칭 관리</AdminTitle>
        <AdminSubtitle>언어교환 매칭 요청 관리</AdminSubtitle>
      </AdminHeader>

      <StatsGrid>
        <StatCard>
          <StatNumber>{stats.pending}</StatNumber>
          <StatLabel>승인 대기</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{stats.matched}</StatNumber>
          <StatLabel>매칭 완료</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{stats.rejected}</StatNumber>
          <StatLabel>거부됨</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{stats.total}</StatNumber>
          <StatLabel>전체 요청</StatLabel>
        </StatCard>
      </StatsGrid>

      <TabContainer>
        <TabList>
          <Tab
            $active={activeTab === "pending"}
            onClick={() => setActiveTab("pending")}
          >
            승인 대기 ({stats.pending})
          </Tab>
          <Tab
            $active={activeTab === "matched"}
            onClick={() => setActiveTab("matched")}
          >
            매칭 완료 ({stats.matched})
          </Tab>
          <Tab
            $active={activeTab === "rejected"}
            onClick={() => setActiveTab("rejected")}
          >
            거부됨 ({stats.rejected})
          </Tab>
        </TabList>

        <TabContent>{renderRequests()}</TabContent>
      </TabContainer>

      {/* 파트너 선택 모달 */}
      {showPartnerModal && (
        <ModalOverlay onClick={() => setShowPartnerModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>매칭 파트너 선택</ModalTitle>
            <p
              style={{
                textAlign: "center",
                color: "#666",
                marginBottom: "1rem",
              }}
            >
              <strong>{selectedRequest?.user?.nickname}</strong>님과 매칭할
              파트너를 선택하세요
            </p>

            <PartnerList>
              {availablePartners.map((partner) => (
                <PartnerCard
                  key={partner.id}
                  selected={selectedPartner?.id === partner.id}
                  onClick={() => handlePartnerSelect(partner)}
                >
                  <PartnerName>{partner.nickname}</PartnerName>
                  <PartnerInfo>
                    {partner.gender} • {partner.university || partner.school}
                  </PartnerInfo>
                  <LanguageTags>
                    <LanguageTag>
                      가르칠 수 있는 언어:{" "}
                      {partner.teaching_languages?.join(", ")}
                    </LanguageTag>
                    <LanguageTag>
                      배우고 싶은 언어: {partner.learning_languages?.join(", ")}
                    </LanguageTag>
                  </LanguageTags>
                </PartnerCard>
              ))}
            </PartnerList>

            {availablePartners.length === 0 && (
              <div
                style={{ textAlign: "center", padding: "2rem", color: "#666" }}
              >
                현재 매칭 가능한 파트너가 없습니다.
              </div>
            )}

            <ModalButtons>
              <ActionBtn
                variant="secondary"
                onClick={() => setShowPartnerModal(false)}
              >
                취소
              </ActionBtn>
              <ActionBtn
                variant="primary"
                onClick={handleConfirmMatch}
                disabled={!selectedPartner}
              >
                매칭 승인
              </ActionBtn>
            </ModalButtons>
          </ModalContent>
        </ModalOverlay>
      )}
    </AdminContainer>
  );
};

export default AdminMatching;
