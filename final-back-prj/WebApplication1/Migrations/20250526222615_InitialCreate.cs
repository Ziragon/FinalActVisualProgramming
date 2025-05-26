using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace WebApplication1.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "files",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    type = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    content = table.Column<byte[]>(type: "bytea", nullable: false),
                    upload_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_files", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "roles",
                columns: table => new
                {
                    role_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    role_name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_roles", x => x.role_id);
                });

            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    user_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    login = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    password_hash = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    role_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users", x => x.user_id);
                    table.ForeignKey(
                        name: "FK_users_roles_role_id",
                        column: x => x.role_id,
                        principalTable: "roles",
                        principalColumn: "role_id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "profile",
                columns: table => new
                {
                    user_id = table.Column<int>(type: "integer", nullable: false),
                    profile_pic_id = table.Column<int>(type: "integer", maxLength: 255, nullable: true),
                    full_name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    email = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    institution = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    field_of_expertise = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_profile", x => x.user_id);
                    table.ForeignKey(
                        name: "FK_profile_files_profile_pic_id",
                        column: x => x.profile_pic_id,
                        principalTable: "files",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_profile_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "articles",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    article = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    user_id = table.Column<int>(type: "integer", nullable: false),
                    category = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    body = table.Column<string>(type: "text", nullable: true),
                    body_id = table.Column<int>(type: "integer", maxLength: 255, nullable: true),
                    tags = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    request_date = table.Column<DateTime>(type: "timestamp", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_articles", x => x.id);
                    table.ForeignKey(
                        name: "FK_articles_files_body_id",
                        column: x => x.body_id,
                        principalTable: "files",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_articles_profile_user_id",
                        column: x => x.user_id,
                        principalTable: "profile",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "reviews",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    article_id = table.Column<int>(type: "integer", nullable: false),
                    user_id = table.Column<int>(type: "integer", nullable: false),
                    rating = table.Column<int>(type: "integer", nullable: true),
                    decision = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    technical_merit = table.Column<string>(type: "text", nullable: true),
                    originality = table.Column<string>(type: "text", nullable: true),
                    presentation_quality = table.Column<string>(type: "text", nullable: true),
                    comments_to_author = table.Column<string>(type: "text", nullable: true),
                    confidential_comments = table.Column<string>(type: "text", nullable: true),
                    attachments_id = table.Column<int>(type: "integer", maxLength: 255, nullable: true),
                    progress = table.Column<int>(type: "integer", nullable: false),
                    status = table.Column<bool>(type: "boolean", nullable: false),
                    complete_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_reviews", x => x.id);
                    table.ForeignKey(
                        name: "FK_reviews_articles_article_id",
                        column: x => x.article_id,
                        principalTable: "articles",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_reviews_files_attachments_id",
                        column: x => x.attachments_id,
                        principalTable: "files",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_reviews_profile_user_id",
                        column: x => x.user_id,
                        principalTable: "profile",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_articles_body_id",
                table: "articles",
                column: "body_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_articles_user_id",
                table: "articles",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_profile_profile_pic_id",
                table: "profile",
                column: "profile_pic_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_reviews_article_id",
                table: "reviews",
                column: "article_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_reviews_attachments_id",
                table: "reviews",
                column: "attachments_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_reviews_user_id",
                table: "reviews",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_users_role_id",
                table: "users",
                column: "role_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "reviews");

            migrationBuilder.DropTable(
                name: "articles");

            migrationBuilder.DropTable(
                name: "profile");

            migrationBuilder.DropTable(
                name: "files");

            migrationBuilder.DropTable(
                name: "users");

            migrationBuilder.DropTable(
                name: "roles");
        }
    }
}
