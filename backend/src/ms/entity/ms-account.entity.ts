import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("ms_accounts")
@Index(["userId"], { unique: true }) // one MS account per CRM user
export class MsAccount {
  @PrimaryGeneratedColumn()
  id: number;

  // CRM user ID (RM, Agent, etc.)
  @Column({ type: "int" })
  userId: number;

  // MSAL identifiers
  @Column({ type: "varchar", length: 255 })
  homeAccountId: string;

  @Column({ type: "varchar", length: 255 })
  tenantId: string;

  // Outlook / Azure email
  @Column({ type: "varchar", length: 255 })
  username: string;

  @Column({ type: "varchar", length: 100 })
  environment: string;

  // 🔐 Access token (short-lived)
  @Column({ type: "longtext" })
  accessToken: string;

  // 🔁 Refresh token (long-lived)
  @Column({ type: "longtext", nullable: true })
  refreshToken: string;

  // ⏰ Token expiry (VERY IMPORTANT)
  @Column({ type: "datetime", nullable: true })
  expiresOn: Date;

  // Metadata
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
