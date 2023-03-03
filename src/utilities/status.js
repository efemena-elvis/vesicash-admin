export default {
  "sent - awaiting confirmation": "progress",
  "sent - Rejected": "error",
  "accepted - not funded": "error",
  "accepted - funded": "okay",
  draft: "okay",
  "in progress": "progress",
  delivered: "okay",
  "delivered - accepted": "success",
  "delivered - rejected": "error",
  "closed - disbursement complete": "success",
  completed: "success",
  "closed - refunded": "error",
  "closed - not funded": "error",
  closed: "error",
  pending: "progress",
  failed: "error",
};

export const escrow_payment_table_empty_states = {
  "sent - awaiting confirmation":
    "No payment has been made for this escrow transaction.",
  "sent - Rejected": "No payment made as transaction was rejected",
  "accepted - not funded":
    "No payment has been made for this escrow transaction.",
  "accepted - funded": "",
  draft: "No payment has been made for this escrow transaction.",
  "in progress": "No payment has been made for this escrow transaction.",
  delivered: "",
  "delivered - accepted": "success",
  "delivered - rejected":
    "No payment has been made for this escrow transaction.",
  "closed - disbursement complete": "",
  completed: "",
  "closed - refunded": "Payment was refunded to buyer.",
  "closed - not funded": "Transaction closed without any payment.",
  closed: "",
  pending: "No payment has been made for this escrow transaction.",
  failed: "No payment has been made for this escrow transaction.",
};

export const escrow_disbursement_table_empty_states = {
  "sent - awaiting confirmation":
    "No disbursement has been made for this escrow transaction.",
  "sent - Rejected": "No disbursement made as transaction was rejected",
  "accepted - not funded":
    "No disbursement has been made for this escrow transaction.",
  "accepted - funded": "",
  draft: "No disbursement has been made for this escrow transaction.",
  "in progress": "No disbursement has been made for this escrow transaction.",
  delivered: "",
  "delivered - accepted": "success",
  "delivered - rejected":
    "No disbursement has been made for this escrow transaction.",
  "closed - disbursement complete": "",
  completed: "",
  "closed - refunded": "No disbursement as payment was refunded to buyer.",
  "closed - not funded": "Transaction closed without any disbursement.",
  closed: "",
  pending: "No disbursement has been made for this escrow transaction.",
  failed: "No disbursement has been made for this escrow transaction.",
};
