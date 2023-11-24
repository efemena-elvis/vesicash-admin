export default {
  "sent - awaiting confirmation": "progress",
  "sent - Rejected": "error",
  "accepted - not funded": "error",
  "accepted - funded": "okay",
  "funded - rejected": "error",
  draft: "progress",
  "in progress": "progress",
  delivered: "okay",
  "delivered - accepted": "success",
  "delivered - rejected": "error",
  "closed - disbursement pending": "progress",
  "closed - manual disbursement pending": "progress",
  "closed - disbursement complete": "success",
  "closed - disputed": "error",
  completed: "success",
  "closed - refunded": "error",
  "closed - not funded": "error",
  closed: "error",
  pending: "progress",
  failed: "error",
  active: "progress",
  deleted: "error",
};

export const escrow_transaction_status = [
  "Draft",
  "Sent - Awaiting Confirmation",
  "Sent - Rejected",
  "Accepted - Funded",
  "Accepted - Not Funded",
  "Funded - Rejected",
  "In Progress",
  "Delivered",
  "Delivered - Accepted",
  "Delivered - Rejected",
  "Closed - Disbursement Pending",
  "Closed - Manual Disbursement Pending",
  "Closed - Disbursement Complete",
  "Closed - Disputed",
  "Closed - Not Funded",
  "Closed",
  "Draft",
  "Active",
  "Closed - Refunded",
  "Deleted",
];

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
  "delivered - accepted":
    "No payment has been made for this escrow transaction.",
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
  "delivered - accepted":
    "No disbursement has been made for this escrow transaction.",
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
