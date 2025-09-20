import React, { useState } from "react";
import styled from "styled-components";
import { useLanguage } from "../contexts/LanguageContext";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;

  .dark-mode & {
    background: #2d2d2d;
    color: white;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;

  &:hover {
    color: #333;
  }

  .dark-mode & {
    color: #ccc;

    &:hover {
      color: white;
    }
  }
`;

const ReportForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ReportReason = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 14px;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #007bff;
  }

  .dark-mode & {
    background: #3d3d3d;
    border-color: #555;
    color: white;

    &:focus {
      border-color: #007bff;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 8px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(Button)`
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  color: #6c757d;

  &:hover:not(:disabled) {
    background: #e9ecef;
  }

  .dark-mode & {
    background: #4d4d4d;
    border-color: #666;
    color: #ccc;

    &:hover:not(:disabled) {
      background: #5d5d5d;
    }
  }
`;

const ReportButton = styled(Button)`
  background: #dc3545;
  border: 1px solid #dc3545;
  color: white;

  &:hover:not(:disabled) {
    background: #c82333;
    border-color: #bd2130;
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ReportModal = ({ isOpen, onClose, onReport, reportedUser }) => {
  const { t } = useLanguage();
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reason.trim()) {
      alert(t("reportModal.reasonRequired"));
      return;
    }

    setIsSubmitting(true);
    try {
      await onReport(reason.trim());
      setReason("");
      onClose();
    } catch (error) {
      alert(t("reportModal.submitError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setReason("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{t("reportModal.title")}</ModalTitle>
          <CloseButton onClick={handleClose} disabled={isSubmitting}>
            ×
          </CloseButton>
        </ModalHeader>

        <ReportForm onSubmit={handleSubmit}>
          <div>
            <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#666" }}>
              {t("reportModal.reportedUser")}:{" "}
              <strong>
                {reportedUser?.nickname || reportedUser?.username}
              </strong>
            </p>
            <p
              style={{ margin: "0 0 12px 0", fontSize: "13px", color: "#888" }}
            >
              {t("reportModal.description")}
            </p>
          </div>

          <ReportReason
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={t("reportModal.placeholder")}
            disabled={isSubmitting}
            maxLength={1000}
          />

          <div style={{ fontSize: "12px", color: "#888", textAlign: "right" }}>
            {reason.length}/1000
          </div>

          <ButtonGroup>
            <CancelButton
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              {t("reportModal.cancel")}
            </CancelButton>
            <ReportButton
              type="submit"
              disabled={isSubmitting || !reason.trim()}
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner />
                  <span style={{ marginLeft: "8px" }}>
                    {t("reportModal.submitting")}
                  </span>
                </>
              ) : (
                t("reportModal.submit")
              )}
            </ReportButton>
          </ButtonGroup>
        </ReportForm>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ReportModal;
