export interface IPrinter {
  id: string
  name: string
  ipAddress: string
  type: string
  createdAt: string
  updatedAt: string
}

export interface IPrinterCreate {
  name: string
  ipAddress: string
  type: string
}

export interface IPrinterUpdate {
  name?: string
  ipAddress?: string
  type?: string
}