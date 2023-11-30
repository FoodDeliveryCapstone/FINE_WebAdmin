export type TTransaction = {
    id: string
    accountId: string
    amount: number
    notes: string
    isIncrease: boolean
    type: number
    status: number
    createdAt: string
    updatedAt: string
};

export type TTransactionRefund = {
    id: string
    orderId: string
    amount: number
    type: number
    note: string
}
