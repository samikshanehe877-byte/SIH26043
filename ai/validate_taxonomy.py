import json

TAXONOMY_FILE = "data/taxonomy.json"


def validate_taxonomy():
    # Load taxonomy
    with open(TAXONOMY_FILE, "r", encoding="utf-8") as file:
        taxonomy = json.load(file)

    print("Taxonomy loaded successfully!\n")

    # Check number of domains
    print(f"Total domains: {len(taxonomy)}")

    total_subdomains = 0
    total_examples = 0

    # Check each domain
    for domain, domain_data in taxonomy.items():

        if "description" not in domain_data:
            print(f"ERROR: {domain} has no description")

        if "subdomains" not in domain_data:
            print(f"ERROR: {domain} has no subdomains")
            continue

        subdomains = domain_data["subdomains"]

        print(f"\n{domain}")
        print(f"  Subdomains: {len(subdomains)}")

        total_subdomains += len(subdomains)

        # Check each subdomain
        for subdomain, subdomain_data in subdomains.items():

            if "description" not in subdomain_data:
                print(f"  ERROR: {subdomain} has no description")

            if "examples" not in subdomain_data:
                print(f"  ERROR: {subdomain} has no examples")
            else:
                total_examples += len(subdomain_data["examples"])

    print("\n-----------------------------")
    print("TAXONOMY SUMMARY")
    print("-----------------------------")
    print(f"Domains:      {len(taxonomy)}")
    print(f"Subdomains:   {total_subdomains}")
    print(f"Examples:     {total_examples}")
    print("-----------------------------")


if __name__ == "__main__":
    validate_taxonomy()